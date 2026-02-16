from flask import Flask, request, jsonify # Flask web framework
from flask_cors import CORS # handle Cross-Origin Resource Sharing
from chatbot_logic import chatbot_response

app = Flask(__name__) # create Flask app
CORS(app)  # allows React frontend to talk to Flask backend

@app.route("/chat", methods=["POST"]) # define /chat endpoint
def chat():
    data = request.get_json() # get JSON data from request
    user_message = data.get("message", "") # extract user message
    bot_reply = chatbot_response(user_message) # get bot reply
    return jsonify({"reply": bot_reply}) # return bot reply as JSON

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True) # run app on localhost:5000
