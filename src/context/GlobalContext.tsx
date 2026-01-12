import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";

interface GlobalContextType {
  navigate: NavigateFunction;
  backendUrl: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  chatRoomIds: string[];
  setChatRoomIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const GlobalContextProvider = ({ children }: ShopContextProviderProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [chatRoomIds, setChatRoomIds] = useState<string[]>([]);

  useEffect(()=>{
    if (!token&&localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  },[])

  const value: GlobalContextType = {
    navigate,
    backendUrl,
    token,
    setToken,
    chatRoomIds,
    setChatRoomIds
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;