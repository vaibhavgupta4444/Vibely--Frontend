import { useEffect, useRef } from "react";

interface Message {
  _id: string;
  sender: {
    _id: string;
    email: string;
  };
  receiver: {
    _id: string;
    email: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatAreaProps {
  messages: Message[];
  currentUserId: string;
}

const ChatArea = ({ messages, currentUserId }: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((msg) => {
            const isSentByCurrentUser = msg.sender._id === currentUserId;

            return (
              <div
                key={msg._id}
                className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isSentByCurrentUser
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.sender.email}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatArea;