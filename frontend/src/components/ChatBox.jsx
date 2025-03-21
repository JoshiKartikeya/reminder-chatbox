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

    setIsLoading(true);

    try {
      const userMessage = { text: inputMessage, type: "user" };
      setMessages(prev => [...prev, userMessage]);
      
      const nlpResponse = await axios.post("http://localhost:5001/extract", {
        text: inputMessage.trim()  // Use actual input instead of test message
      });

      if (!nlpResponse.data) {
        throw new Error('No response from NLP service');
      }

      console.log("NLP Response:", nlpResponse.data);

      if (nlpResponse.data && nlpResponse.data.task) {
        const reminderResponse = await axios.post(
          "http://localhost:5000/api/reminders",
          {
            task: nlpResponse.data.task,
            deadline: nlpResponse.data.deadline || new Date(),
            app: nlpResponse.data.app || "default",
          }
        );

        console.log("Reminder Response:", reminderResponse.data); // Add logging

        setMessages((prev) => [
          ...prev,
          { text: `Reminder set: ${nlpResponse.data.task}`, type: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      setMessages(prev => [...prev, {
        text: "Service connection error. Please ensure both backend and NLP services are running.",
        type: "bot"
      }]);
    } finally {
      setIsLoading(false);
    }

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
              {message.text}{" "}
              {/* Changed from message.content to message.text */}
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
