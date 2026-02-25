import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Send, MessageSquare, ChevronLeft, Plus } from "lucide-react";

interface MessageType {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
}

const CURRENT_USER = "student";

export default function Message() {
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ NEW MESSAGE STATES
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatUser, setNewChatUser] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ================= LOAD =================
  useEffect(() => {
    const stored = localStorage.getItem("messages");
    if (stored) {
      setAllMessages(JSON.parse(stored));
    }
  }, []);

  // ================= CONVERSATIONS =================
  const conversations = useMemo(() => {
    const users = new Set<string>();

    allMessages.forEach((m) => {
      if (m.sender === CURRENT_USER) users.add(m.receiver);
      if (m.receiver === CURRENT_USER) users.add(m.sender);
    });

    return Array.from(users);
  }, [allMessages]);

  // ================= ACTIVE CHAT =================
  const messages = useMemo(() => {
    if (!selectedUser) return [];

    return allMessages.filter(
      (m) =>
        (m.sender === CURRENT_USER && m.receiver === selectedUser) ||
        (m.sender === selectedUser && m.receiver === CURRENT_USER)
    );
  }, [allMessages, selectedUser]);

  // ================= SEARCH =================
  const filteredConversations = useMemo(() => {
    return conversations.filter((user) =>
      user.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg: MessageType = {
      id: Date.now().toString(),
      sender: CURRENT_USER,
      receiver: selectedUser,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...allMessages, newMsg];
    localStorage.setItem("messages", JSON.stringify(updated));
    setAllMessages(updated);
    setNewMessage("");
  };

  // ================= START NEW CHAT =================
  const startConversation = () => {
    const user = newChatUser.trim().toLowerCase();

    if (!user || user === CURRENT_USER) return;

    setSelectedUser(user);
    setShowNewChat(false);
    setNewChatUser("");
    setShowSidebar(false);
  };

  return (
    <div className="h-screen flex bg-white">
      {/* ================= SIDEBAR ================= */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden md:flex"
        } flex-col w-full md:w-80 border-r border-gray-300`}
      >
        <div className="p-4 border-b border-gray-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>

            <button
              onClick={() => setShowNewChat(true)}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <MessageSquare className="mx-auto mb-2" />
              No conversations
            </div>
          ) : (
            filteredConversations.map((user) => (
              <button
                key={user}
                onClick={() => {
                  setSelectedUser(user);
                  setShowSidebar(false);
                }}
                className={`w-full text-left p-3 rounded-lg mb-2 transition ${
                  selectedUser === user
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {user}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <button
                className="md:hidden"
                onClick={() => setShowSidebar(true)}
              >
                <ChevronLeft />
              </button>
              <h3 className="font-semibold">{selectedUser}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isOwn = msg.sender === CURRENT_USER;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm ${
                        isOwn
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>

      {/* ================= NEW CHAT MODAL ================= */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Start new chat</h3>

            <input
              autoFocus
              value={newChatUser}
              onChange={(e) => setNewChatUser(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startConversation()}
              placeholder="Enter username..."
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewChat(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={startConversation}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}