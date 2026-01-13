import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type TReceiver = {
  firstName: string;
  lastName: string;
  email: string;
}

type TLatestMessage = {
  sender: string;
  content: string;
  isRead: boolean;
  updatedAt: Date;
}

type ChatRoom = {
  id: string;
  receivers: TReceiver[],
  latestMessage: TLatestMessage
};


interface GlobalContextType {
  navigate: NavigateFunction;
  backendUrl: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  chatRooms: ChatRoom[];
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>;
  selectedChatRoom: ChatRoom | null;
  setSelectedChatRoom: React.Dispatch<React.SetStateAction<ChatRoom | null>>;
  currentUser: string | null;
}

interface ShopContextProviderProps {
  children: ReactNode;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);



const GlobalContextProvider = ({ children }: ShopContextProviderProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Decode user from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        // console.log("Full decoded token:", decoded);
        
        const userId = decoded.id;
        setCurrentUser(userId as string);
      } catch (error) {
        console.error("Error decoding token:", error);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, [token]);

  const getChatRooms = async (token: string | null) => {
    try {
      const response = await axios.get<{ chatRooms: ChatRoom[] }>(
        `${backendUrl}/v1/chat-room`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChatRooms(response.data.chatRooms);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(()=>{
    if (!token&&localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  },[]);

  useEffect(()=>{
    getChatRooms(token)
  },[token]);

  const value: GlobalContextType = {
    navigate,
    backendUrl,
    token,
    setToken,
    chatRooms,
    setChatRooms,
    selectedChatRoom,
    setSelectedChatRoom,
    currentUser
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;