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
Then open your browser at https://localhost:5000/
