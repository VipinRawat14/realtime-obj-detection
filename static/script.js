const video = document.getElementById('camera');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const objectsText = document.getElementById('objects');

let useBackCamera = true;
let currentStream = null;
let speechEnabled = false;
let isSpeaking = false;
let currentUtterance = null;

const lastSeen = {};
const spokenRecently = {};

function toggleSpeech() {
    speechEnabled = !speechEnabled;
    document.getElementById('talkBtn').innerText = speechEnabled ? "Disable Talk" : "Enable Talk";

    if (!speechEnabled) {
        speechSynthesis.cancel(); // Immediately stop all current speech
        isSpeaking = false;
        currentUtterance = null;
    }
}

function speak(text) {
    if (!speechEnabled) return;
    if (isSpeaking) return;

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 1;
    currentUtterance.pitch = 1;

    currentUtterance.onend = () => {
        isSpeaking = false;
    };

    isSpeaking = true;
    speechSynthesis.speak(currentUtterance);
}

function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
        video: {
            facingMode: { exact: useBackCamera ? "environment" : "user" }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Camera access error:", err);
            objectsText.textContent = "Camera error: " + err.message;
        });
}

function toggleCamera() {
    useBackCamera = !useBackCamera;
    startCamera();
}

startCamera();

setInterval(() => {
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const offscreen = document.createElement('canvas');
    offscreen.width = video.videoWidth;
    offscreen.height = video.videoHeight;
    const offCtx = offscreen.getContext('2d');
    offCtx.drawImage(video, 0, 0);

    const image = offscreen.toDataURL('image/jpeg');

    fetch('/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image })
    })
    .then(res => res.json())
    .then(data => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (data.objects) {
            const now = Date.now();
            const currentLabels = new Set();

            objectsText.textContent = "Objects: " + data.objects.map(obj => obj.label).join(', ');

            data.objects.forEach(obj => {
                const [x1, y1, x2, y2] = obj.box;
                const label = obj.label;
                currentLabels.add(label);

                ctx.strokeStyle = "lime";
                ctx.lineWidth = 3;
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

                ctx.fillStyle = "lime";
                ctx.font = "16px sans-serif";
                ctx.fillText(label, x1, y1 > 20 ? y1 - 5 : y1 + 15);

                const lastSpoken = spokenRecently[label] || 0;
                const lastSeenTime = lastSeen[label] || 0;

                if ((now - lastSpoken > 6000) && (now - lastSeenTime < 3000)) {
                    speak(label);
                    spokenRecently[label] = now;
                }

                lastSeen[label] = now;
            });

            // Clear old labels that disappeared for >3s
            Object.keys(lastSeen).forEach(label => {
                if (!currentLabels.has(label) && (now - lastSeen[label] > 3000)) {
                    delete lastSeen[label];
                    delete spokenRecently[label];
                }
            });
        }
    })
    .catch(err => {
        console.error("Detection error:", err);
    });
}, 300);
