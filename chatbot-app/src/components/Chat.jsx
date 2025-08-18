import React, { useState, useRef, useEffect } from "react";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { nhost } from "../config/nhost";
import { useNavigate, Link } from "react-router-dom";
import { useAuthenticationStatus } from "@nhost/react";

// GraphQL Queries & Mutations
const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`;

const GET_MESSAGES = gql`
  subscription GetMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      content
      user_id
      sender
      created_at
    }
  }
`;

const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: uuid!, $content: String!, $sender: String!) {
    sendMessage(input: { chat_id: $chatId, content: $content, sender: $sender }) {
      success
      message
    }
  }
`;

const INSERT_MESSAGE = gql`
  mutation InsertMessage($chatId: uuid!, $content: String!, $sender: String!) {
    insert_messages_one(object: {
      chat_id: $chatId,
      content: $content,
      sender: $sender
    }) {
      id
      content
      chat_id
      user_id
      created_at
    }
  }
`;

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newChatTitle, setNewChatTitle] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // New state for loading indicator
  const navigate = useNavigate();
  const user = nhost.auth.getUser();

  const messagesEndRef = useRef(null);

  const { data: chatsData, refetch: refetchChats } = useQuery(GET_CHATS);
  const { data: messagesData } = useSubscription(GET_MESSAGES, {
    variables: { chatId: selectedChat },
    skip: !selectedChat,
  });

  const [createChat] = useMutation(CREATE_CHAT);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [insertMessage] = useMutation(INSERT_MESSAGE);

  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) return;
    try {
      const res = await createChat({ variables: { title: newChatTitle } });
      setNewChatTitle("");
      refetchChats();
      setSelectedChat(res.data.insert_chats_one.id);
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      content: newMessage,
      user_id: user?.id,
      sender: "user",
      created_at: new Date().toISOString(),
    };

    setLocalMessages((msgs) => [...msgs, tempMessage]);
    setNewMessage("");

    try {
      setIsTyping(true); // Start typing indicator
      await insertMessage({
        variables: {
          chatId: selectedChat,
          content: tempMessage.content,
          sender: "user",
        },
      });

      setLocalMessages((msgs) => msgs.filter((m) => m.id !== tempId));

      await sendMessage({
        variables: {
          chatId: selectedChat,
          content: tempMessage.content,
          sender: "user",
        },
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setLocalMessages((msgs) => msgs.filter((m) => m.id !== tempId));
    } finally {
      setIsTyping(false); // Stop typing indicator
    }
  };

  const handleLogout = async () => {
    await nhost.auth.signOut();
    navigate("/sign-in");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData, localMessages, isTyping]);

  const combinedMessages = [
    ...(messagesData?.messages || []),
    ...localMessages.filter(
      (local) => !(messagesData?.messages || []).some((m) => m.id === local.id)
    ),
  ];

  if (isTyping) {
    combinedMessages.push({
      id: "typing-indicator",
      content: "AI Assistant is typing...",
      sender: "ai-loading",
      created_at: new Date().toISOString(),
    });
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-neutral-700 bg-neutral-900 flex flex-col">
        <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-950 flex items-center justify-center text-white font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user?.displayName || "User"}</div>
              <div className="text-xs text-neutral-400">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xl font-bold text-neutral-300 mb-4">Your Chats</h3>
          {chatsData?.chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                selectedChat === chat.id
                  ? "bg-blue-950/50 border border-purple-900/30"
                  : "hover:bg-neutral-800"
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="font-medium">{chat.title}</div>
              <div className="text-xs text-neutral-400">{new Date(chat.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* New Chat */}
        <div className="p-4 border-t border-neutral-700">
          <input
            type="text"
            placeholder="New Chat Title"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-100 placeholder-neutral-400 mb-2"
          />
          <button
            onClick={handleCreateChat}
            className="w-full py-2 bg-gradient-to-r from-blue-950 to-purple-950 hover:from-blue-900 hover:to-purple-900 text-white font-medium rounded-lg transition-all"
          >
            Create Chat
          </button>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col p-4 bg-neutral-950">
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {combinedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl text-neutral-100 py-3 px-5 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-purple-900 rounded-br-none"
                        : "bg-neutral-800 rounded-bl-none"
                    } ${msg.sender === "ai-loading" ? "animate-pulse" : ""}`}
                  >
                    <div className="font-semibold">{msg.sender === "user" ? "You" : "AI Assistant"}</div>
                    <div className="mt-1">
                      {msg.sender === "ai-loading" ? "..." : msg.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {msg.sender === "ai-loading" ? "" : new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-100 placeholder-neutral-400"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-gradient-to-r from-blue-950 to-purple-950 hover:from-blue-900 hover:to-purple-900 text-white font-medium rounded-lg transition-all"
                disabled={isTyping}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-neutral-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-xl">Select a chat to start messaging</p>
              <p className="text-sm mt-2">or create a new chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
