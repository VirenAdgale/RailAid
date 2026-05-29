import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from chatbot_logic import chatbot_response

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "railaid_chatbot"})


@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "")
    return jsonify({"reply": chatbot_response(user_message)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5002)))
