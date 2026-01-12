import { useEffect, useState } from "react";
import { socket } from "../Socket";
import { Input } from "@/components/ui/input";
import ChatArea from "./ChatArea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

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

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Test user IDs - replace with actual authenticated user
  const CURRENT_USER_ID = "67830b3e9e6d58e639ba0001";
  const RECEIVER_USER_ID = "67830b3e9e6d58e639ba0002";

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Connected to socket:", socket.id);
    };

    const onDisconnect = () => {
      console.log("Disconnected from socket");
    };

    const onReceiveMessage = (data: Message) => {
      console.log("Message received:", data);
      setMessages((prev) => [...prev, data]);
    };

    const onMessageSent = (data: Message) => {
      console.log("Message sent:", data);
      setMessages((prev) => [...prev, data]);
      setIsLoading(false);
    };

    const onError = (data: { message: string }) => {
      console.error("Socket error:", data.message);
      setIsLoading(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receiveMessage", onReceiveMessage);
    socket.on("messageSent", onMessageSent);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("messageSent", onMessageSent);
      socket.off("error", onError);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    setIsLoading(true);
    socket.emit("sendMessage", {
      sender: CURRENT_USER_ID,
      receiver: RECEIVER_USER_ID,
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-full w-3/4">
      <ChatArea messages={messages} currentUserId={CURRENT_USER_ID} />

      <div className="shrink-0 flex items-center gap-3 p-4 border-t">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading}
        />

        <Button onClick={sendMessage} disabled={isLoading}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;