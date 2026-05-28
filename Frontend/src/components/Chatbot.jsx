import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { CHATBOT_API_URL } from "../config/api";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    const nextInput = input.trim();
    if (!nextInput) return;

    setMessages((prev) => [...prev, { sender: "user", text: nextInput }]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: nextInput })
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "I could not find a response for that." }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I am having trouble connecting to the support server." }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chatbot">
      <h2>Chat with RailAid Assistant</h2>
      <div className="chat-window">
        {messages.length === 0 && (
          <div className="chat-empty">
            Ask about booking, wheelchair assistance, payments, refunds, or station support.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={`${msg.sender}-${i}`} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={isSending || !input.trim()}
          title="Send message"
        >
          <SendHorizonal size={18} />
          <span>{isSending ? "Sending" : "Send"}</span>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
