import { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = {
      type: "user",
      content: inputMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // First, process with NLP service
      const nlpResponse = await axios.post("http://localhost:5001/extract", {
        text: inputMessage,
      });

      // Then, create reminder with processed data
      await axios.post("http://localhost:5000/api/reminders", {
        task: nlpResponse.data.task,
        deadline: nlpResponse.data.deadline,
        app: nlpResponse.data.app,
      });

      // Add bot response to chat
      const botMessage = {
        type: "bot",
        content: `✅ Reminder set: "${nlpResponse.data.task}" for ${new Date(
          nlpResponse.data.deadline
        ).toLocaleString()}`,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Request failed:", error);
      const errorMessage = {
        type: "bot",
        content: "❌ Sorry, I couldn't process that request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your reminder here..."
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
