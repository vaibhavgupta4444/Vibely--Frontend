import { useEffect, useState } from "react";
import { socket } from "../Socket";
import { Input } from "@/components/ui/input";
import ChatArea from "./ChatArea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useGlobalContext } from "@/helper/globalContextHook";
import axios from "axios";

interface Message {
  _id: string;
  sender: {
    _id: string;
    email: string;
    name: string;
  };
  receiver: {
    _id: string;
    email: string;
    name: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChatRoom, currentUser, token, backendUrl } = useGlobalContext();

  const receiver = selectedChatRoom?.receivers[0];

  // Fetch messages when a chat room is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChatRoom || !token) return;

      try {
        const response = await axios.get(
          `${backendUrl}/v1/chat-room/${selectedChatRoom.id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedChatRoom, token, backendUrl]);

  // Socket connection and event handlers
  useEffect(() => {
    if (!currentUser) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Connected to socket:", socket.id);
      // Join with user ID
      socket.emit("join", currentUser);
    };

    const onDisconnect = () => {
      console.log("Disconnected from socket");
    };

    const onReceiveMessage = (data: Message) => {
      console.log("Message received:", data);
      if (selectedChatRoom && data.sender._id !== currentUser) {
        setMessages((prev) => [...prev, data]);
      }
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

    // If already connected, join immediately
    if (socket.connected) {
      socket.emit("join", currentUser);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("messageSent", onMessageSent);
      socket.off("error", onError);
    };
  }, [currentUser, selectedChatRoom]);

  const sendMessage = () => {
    console.log(currentUser);
    if (!message.trim() || !receiver || !selectedChatRoom || !currentUser) return;

    setIsLoading(true);
    socket.emit("sendMessage", {
      sender: currentUser,
      receiver: receiver.email,
      content: message,
    });

    setMessage("");
  };

  // Show empty state if no chat room is selected
  if (!selectedChatRoom) {
    return (
      <div className="flex flex-col h-full w-3/4 items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <p className="text-lg font-semibold mb-2">No chat selected</p>
          <p className="text-sm">Select a contact to start chatting</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col h-full w-3/4 items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <p className="text-lg font-semibold mb-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-3/4">
      {/* Chat Header */}
      <div className="shrink-0 p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {receiver?.firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">
              {receiver?.firstName} {receiver?.lastName}
            </h3>
            <p className="text-xs text-gray-500">{receiver?.email}</p>
          </div>
        </div>
      </div>

      <ChatArea messages={messages} currentUserId={currentUser} />

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