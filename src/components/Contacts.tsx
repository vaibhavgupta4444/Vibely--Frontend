import { MessageCircleCode, Search, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useGlobalContext } from "@/helper/globalContextHook"


const Contacts = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { backendUrl, token, setChatRoomIds } = useGlobalContext();

  // Sample contacts data - replace with actual API data
  const contacts = [
    { id: "1", name: "John Doe", email: "john@example.com", lastMessage: "Hey there!", unread: 2 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", lastMessage: "See you tomorrow", unread: 0 },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", lastMessage: "Thanks!", unread: 1 },
  ];

  const findFriend = async () => {
    try {
      const response = await axios.post(`${backendUrl}/v1/user/find`, {
        receiverEmail: searchQuery
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.status === 200) {
        const { chatRoomId } = response.data;

        setChatRoomIds((prev) => {
          if (prev.includes(chatRoomId)) return prev;
          return [...prev, chatRoomId];
        });
    }
    } catch (error) {
      toast(error as string);
    }
  }

  return (
    <div className="h-full w-1/4 border-r flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chats</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X size={20} /> : <MessageCircleCode size={20} />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-3 border-b bg-gray-50">
          <div className="relative">
            <Search onClick={findFriend} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? ( //ignore it
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">No contacts found</p>
          </div>
        ) : (
          contacts.map((contact) => ( //ignore it
            <div
              key={contact.id}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                        {contact.unread > 0 && (
                          <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 flex-shrink-0">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                      <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Contacts