
import { useState } from "react";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { nhost } from "../config/nhost";

// Queries
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
      sender
      created_at
    }
  }
`;

// Mutations
const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $user_id: uuid!) {
    insert_chats_one(object: { title: $title, user_id: $user_id }) {
      id
      title
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $user_id: uuid!, $content: String!, $sender: String!) {
    insert_messages_one(
      object: { chat_id: $chat_id, user_id: $user_id, content: $content, sender: $sender }
    ) {
      id
      content
      sender
      created_at
    }
  }
`;

export default function Chat({ userId }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newChatTitle, setNewChatTitle] = useState("");

  const { data: chatsData, refetch: refetchChats } = useQuery(GET_CHATS);
  const { data: messagesData } = useSubscription(GET_MESSAGES, {
    variables: { chatId: selectedChat },
    skip: !selectedChat,
  });

  const [createChat] = useMutation(CREATE_CHAT);
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) return;

    try {
      const res = await createChat({
        variables: { title: newChatTitle, user_id: userId },
      });
      setSelectedChat(res.data.insert_chats_one.id);
      setNewChatTitle("");
      refetchChats();
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await sendMessage({
        variables: {
          chat_id: selectedChat,
          user_id: userId,
          content: newMessage,
          sender: "user",
        },
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleLogout = async () => {
    await nhost.auth.signOut();
    window.location.href = "/sign-in";
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-700 bg-gray-800 p-4 flex flex-col">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Your Chats</h3>

        <div className="flex-1 overflow-y-auto">
          {chatsData?.chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                selectedChat === chat.id
                  ? "bg-cyan-900/50 border border-cyan-400/30"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="font-medium">{chat.title}</div>
              <div className="text-xs text-gray-400">
                {chat.created_at && new Date(chat.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* New Chat */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="New Chat Title"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-100 placeholder-gray-400 mb-2"
          />
          <button
            onClick={handleCreateChat}
            className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all"
          >
            Create Chat
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all"
        >
          Logout
        </button>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col p-4 bg-gray-900">
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messagesData?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                      msg.sender === "user"
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    <div className="font-medium">
                      {msg.sender === "user" ? "You" : "AI Assistant"}
                    </div>
                    <div className="mt-1">{msg.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-100 placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
