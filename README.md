# Real-time Object Detection Web App

This is a real-time object detection web application built using **YOLOv8**, **Flask**, and a **browser-based frontend**.  
It supports webcam streaming, performs server-side detection, and announces detected objects using text-to-speech.

## 🚀 Features

- Real-time webcam feed from browser
- YOLOv8-powered object detection (runs on Flask backend)
- Sends annotated frames back to client
- Text-to-speech announcement of detected objects
- Optimized for mobile + desktop

## 🛠️ Tech Stack

- Python, Flask
- YOLOv8 (Ultralytics)
- OpenCV
- HTML, JavaScript (WebRTC, Canvas, Web Speech API)
- Socket/HTTP streaming

## 📁 Structure

realtime-obj-detection/
├── app.py
├── templates/
│ └── index.html
├── static/
│ └── js/
│ └── script.js
├── yolov8_model/
│ └── yolov8m.pt
└── ...

## 🧠 How it Works

1. Client camera stream captured via HTML5 + JS.
2. Frames sent to Flask server for YOLO detection.
3. Server returns annotated image + object labels.
4. Client announces objects using Web Speech API.

## 🏁 Run Locally

```bash
git clone https://github.com/VipinRawat14/realtime-obj-detection.git
cd realtime-obj-detection
pip install -r requirements.txt
python app.py
Then open your browser at http://localhost:5000/
```


🔐 HTTPS Support (Optional, to run on other devices) 
To enable secure webcam and microphone access (required by most modern browsers), you can run the Flask server with HTTPS using self-signed certificates:

Why HTTPS?
Browsers block webcam/mic access over insecure http://
Features like WebRTC and Web Speech API require https:// on most devices

How to Enable:
1.Generate SSL Certificates (for local testing only):

 bash
 openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

 This will create two files:
 cert.pem – SSL certificate
 key.pem – Private key

2.Update your Flask app.py:

 python
 if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000, ssl_context=('cert.pem', 'key.pem'))
 Run the app and open https://localhost:5000/

🔒 Note: Since this is a self-signed certificate, your browser will show a warning — it’s safe to proceed for local development.
