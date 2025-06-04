from flask import Flask, request, jsonify, render_template
import cv2
import numpy as np
from ultralytics import YOLO
import base64

app = Flask(__name__)
model = YOLO("yolov8m.pt")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    try:
        data = request.get_json()
        img_data = base64.b64decode(data['image'].split(',')[1])

        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        results = model(frame, conf=0.4, verbose=False)  # Adjust confidence threshold here
        objects = []

        result = results[0]
        for box in result.boxes:
            conf = box.conf[0]
            if conf < 0.4:
                continue  # Skip low-confidence boxes

            cls_id = int(box.cls[0])
            label = result.names[cls_id]
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            objects.append({
                "label": label,
                "box": [x1, y1, x2, y2]
            })

        return jsonify({'objects': objects})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context=('cert.pem', 'key.pem'))
