// // import { gql } from "@apollo/client";

// // // Subscription to get messages in real-time
// // export const GET_MESSAGES = gql`
// //   subscription GetMessages {
// //     messages(order_by: { created_at: asc }) {
// //       id
// //       content
// //       created_at
// //       user {
// //         id
// //         display_name
// //       }
// //     }
// //   }
// // `;

// // // Mutation to send a new message
// // export const SEND_MESSAGE = gql`
// //   mutation SendMessage($content: String!) {
// //     insert_messages_one(object: { content: $content }) {
// //       id
// //     }
// //   }
// // `;

// import { gql } from "@apollo/client";

// // Subscription: get messages for a specific chat in real-time
// export const GET_MESSAGES = gql`
//   subscription GetMessages($chat_id: uuid!) {
//     messages(
//       where: { chat_id: { _eq: $chat_id } }
//       order_by: { created_at: asc }
//     ) {
//       id
//       content
//       created_at
//       sender
//       user {
//         id
//         display_name
//       }
//     }
//   }
// `;

// // Mutation: send a new message
// export const SEND_MESSAGE = gql`
//   mutation SendMessage(
//     $chat_id: uuid!,
//     $sender: String!,
//     $content: String!,
//     $user_id: uuid
//   ) {
//     insert_messages_one(
//       object: {
//         chat_id: $chat_id,
//         sender: $sender,
//         content: $content,
//         user_id: $user_id
//       }
//     ) {
//       id
//       content
//       created_at
//       sender
//       user_id
//     }
//   }
// `;


// import { gql } from "@apollo/client";

// // Subscription: get messages for a specific chat in real-time
// export const GET_MESSAGES = gql`
//   subscription GetMessages($chat_id: uuid!) {
//     messages(
//       where: { chat_id: { _eq: $chat_id } }
//       order_by: { created_at: asc }
//     ) {
//       id
//       content
//       created_at
//       sender
//       user {
//         id
//         display_name
//       }
//     }
//   }
// `;

// // Mutation: send a new message
// export const SEND_MESSAGE = gql`
//   mutation SendMessage(
//     $chat_id: uuid!,
//     $sender: String!,
//     $content: String!,
//     $user_id: uuid
//   ) {
//     insert_messages_one(
//       object: {
//         chat_id: $chat_id,
//         sender: $sender,
//         content: $content,
//         user_id: $user_id
//       }
//     ) {
//       id
//       content
//       created_at
//       sender
//       user_id
//     }
//   }
// `;

// // Query: get all chats for a user
// export const GET_USER_CHATS = gql`
//   query GetUserChats($user_id: uuid!) {
//     chats(
//       where: {
//         chat_users: { user_id: { _eq: $user_id } }
//       }
//       order_by: { created_at: asc }
//     ) {
//       id
//       name
//       created_at
//     }
//   }
// `;

// // Mutation: create a new chat
// export const CREATE_CHAT = gql`
//   mutation CreateChat($name: String!, $chat_users: [chat_users_insert_input!]!) {
//     insert_chats_one(
//       object: {
//         name: $name
//         chat_users: {
//           data: $chat_users
//         }
//       }
//     ) {
//       id
//       name
//       created_at
//     }
//   }
// `;



// export const INSERT_CHAT = gql`
//   mutation InsertChat($user_id: uuid!, $title: String!) {
//     insert_chats_one(object: { user_id: $user_id, title: $title }) {
//       id
//       title
//       created_at
//     }
//   }
// `;

// import React, { useState } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import { gql } from "@apollo/client";

// // --- GraphQL Queries & Mutations ---

// // ✅ Mutation to create a new chat
// const CREATE_CHAT = gql`
//   mutation CreateChat($user_id: uuid!, $title: String) {
//     insert_chats_one(object: { user_id: $user_id, title: $title }) {
//       id
//       title
//       created_at
//     }
//   }
// `;

// // ✅ Mutation to insert message
// const SEND_MESSAGE = gql`
//   mutation SendMessage($chat_id: uuid!, $user_id: uuid!, $content: String!, $sender: String!) {
//     insert_messages_one(
//       object: { chat_id: $chat_id, user_id: $user_id, content: $content, sender: $sender }
//     ) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// // ✅ Query to fetch messages in a chat
// const GET_MESSAGES = gql`
//   query GetMessages($chat_id: uuid!) {
//     messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// export default function Chat({ userId }) {
//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [creatingChat, setCreatingChat] = useState(false);

//   const [createChat] = useMutation(CREATE_CHAT);
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   // Load messages if chatId is set
//   const { data, loading, refetch } = useQuery(GET_MESSAGES, {
//     variables: { chat_id: chatId },
//     skip: !chatId, // don’t run query until chat exists
//     pollInterval: 1000, // auto refresh messages
//   });

//   // ✅ Create chat safely (avoid duplicate inserts)
//   const handleCreateChat = async () => {
//     if (creatingChat || chatId) return; // prevent duplicates
//     setCreatingChat(true);
//     try {
//       const res = await createChat({
//         variables: { user_id: userId, title: "New Chat" },
//         fetchPolicy: "no-cache", // avoid Apollo reusing old ids
//       });
//       setChatId(res.data.insert_chats_one.id);
//     } catch (err) {
//       console.error("Error creating chat:", err);
//     } finally {
//       setCreatingChat(false);
//     }
//   };

//   // ✅ Send a message
//   const handleSend = async () => {
//     if (!input.trim() || !chatId) return;
//     try {
//       await sendMessage({
//         variables: {
//           chat_id: chatId,
//           user_id: userId,
//           content: input,
//           sender: "user",
//         },
//       });
//       setInput(""); // clear input
//       refetch(); // refresh messages right after sending
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <div className="p-4">
//       {!chatId ? (
//         <button
//           onClick={handleCreateChat}
//           disabled={creatingChat}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {creatingChat ? "Creating Chat..." : "Start New Chat"}
//         </button>
//       ) : (
//         <>
//           <div className="h-64 overflow-y-auto border p-2 mb-2">
//             {loading ? (
//               <p>Loading messages...</p>
//             ) : (
//               data?.messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={msg.sender === "user" ? "text-right" : "text-left"}
//                 >
//                   <span className="px-2 py-1 rounded bg-gray-200 inline-block my-1">
//                     <b>{msg.sender}:</b> {msg.content}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="flex">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="flex-grow border px-2 py-1 rounded-l"
//               placeholder="Type a message..."
//             />
//             <button
//               onClick={handleSend}
//               className="bg-green-500 text-white px-4 rounded-r"
//             >
//               Send
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import { gql } from "@apollo/client";
// import { v4 as uuidv4 } from "uuid"; // import UUID generator

// // --- GraphQL Queries & Mutations ---

// const CREATE_CHAT = gql`
//   mutation CreateChat($user_id: uuid!, $title: String) {
//     insert_chats_one(object: { user_id: $user_id, title: $title }) {
//       id
//       title
//       created_at
//       user_id
//     }
//   }
// `;

// const SEND_MESSAGE = gql`
//   mutation SendMessage($chat_id: uuid!, $user_id: uuid!, $content: String!, $sender: String!) {
//     insert_messages_one(
//       object: { chat_id: $chat_id, user_id: $user_id, content: $content, sender: $sender }
//     ) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// const GET_MESSAGES = gql`
//   query GetMessages($chat_id: uuid!) {
//     messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// export default function Chat() {
//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [creatingChat, setCreatingChat] = useState(false);
//   const [userId] = useState(uuidv4()); // generate a unique user ID for this session

//   const [createChat] = useMutation(CREATE_CHAT);
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   const { data, loading, refetch } = useQuery(GET_MESSAGES, {
//     variables: { chat_id: chatId },
//     skip: !chatId,
//     pollInterval: 1000,
//   });

//   const handleCreateChat = async () => {
//     if (creatingChat || chatId) return;
//     setCreatingChat(true);
//     try {
//       const res = await createChat({
//         variables: { user_id: userId, title: "New Chat" },
//         fetchPolicy: "no-cache",
//       });
//       setChatId(res.data.insert_chats_one.id);
//     } catch (err) {
//       console.error("Error creating chat:", err);
//     } finally {
//       setCreatingChat(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim() || !chatId) return;
//     try {
//       await sendMessage({
//         variables: {
//           chat_id: chatId,
//           user_id: userId,
//           content: input,
//           sender: "user",
//         },
//       });
//       setInput("");
//       refetch();
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <div className="p-4">
//       {!chatId ? (
//         <button
//           onClick={handleCreateChat}
//           disabled={creatingChat}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {creatingChat ? "Creating Chat..." : "Start New Chat"}
//         </button>
//       ) : (
//         <>
//           <div className="h-64 overflow-y-auto border p-2 mb-2">
//             {loading ? (
//               <p>Loading messages...</p>
//             ) : (
//               data?.messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={msg.sender === "user" ? "text-right" : "text-left"}
//                 >
//                   <span className="px-2 py-1 rounded bg-gray-200 inline-block my-1">
//                     <b>{msg.sender}:</b> {msg.content}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="flex">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="flex-grow border px-2 py-1 rounded-l"
//               placeholder="Type a message..."
//             />
//             <button
//               onClick={handleSend}
//               className="bg-green-500 text-white px-4 rounded-r"
//             >
//               Send
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import { gql } from "@apollo/client";
// import { v4 as uuidv4 } from "uuid";

// // --- GraphQL Queries & Mutations ---
// const CREATE_CHAT = gql`
//   mutation CreateChat($user_id: uuid!, $title: String) {
//     insert_chats_one(object: { user_id: $user_id, title: $title }) {
//       id
//       title
//       created_at
//       user_id
//     }
//   }
// `;

// const SEND_MESSAGE = gql`
//   mutation SendMessage($chat_id: uuid!, $user_id: uuid!, $content: String!, $sender: String!) {
//     insert_messages_one(
//       object: { chat_id: $chat_id, user_id: $user_id, content: $content, sender: $sender }
//     ) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// const GET_MESSAGES = gql`
//   query GetMessages($chat_id: uuid!) {
//     messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// export default function Chat() {
//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [creatingChat, setCreatingChat] = useState(false);

//   // Generate or retrieve persistent userId
//   const [userId, setUserId] = useState(() => {
//     const saved = sessionStorage.getItem("userId");
//     if (saved) return saved;
//     const newId = uuidv4();
//     sessionStorage.setItem("userId", newId);
//     return newId;
//   });

//   const [createChat] = useMutation(CREATE_CHAT);
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   // Load messages if chatId is set
//   const { data, loading, refetch } = useQuery(GET_MESSAGES, {
//     variables: { chat_id: chatId },
//     skip: !chatId,
//     pollInterval: 1000,
//   });

//   const handleCreateChat = async () => {
//     if (creatingChat || chatId) return;
//     setCreatingChat(true);

//     try {
//       const res = await createChat({
//         variables: { user_id: userId, title: "New Chat" },
//         fetchPolicy: "no-cache",
//       });
//       setChatId(res.data.insert_chats_one.id);
//     } catch (err) {
//       console.error("Error creating chat:", err);
//     } finally {
//       setCreatingChat(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim() || !chatId) return;

//     try {
//       await sendMessage({
//         variables: {
//           chat_id: chatId,
//           user_id: userId,
//           content: input,
//           sender: "user",
//         },
//       });
//       setInput("");
//       refetch();
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <div className="p-4">
//       {!chatId ? (
//         <button
//           onClick={handleCreateChat}
//           disabled={creatingChat}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {creatingChat ? "Creating Chat..." : "Start New Chat"}
//         </button>
//       ) : (
//         <>
//           <div className="h-64 overflow-y-auto border p-2 mb-2">
//             {loading ? (
//               <p>Loading messages...</p>
//             ) : (
//               data?.messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={msg.sender === "user" ? "text-right" : "text-left"}
//                 >
//                   <span className="px-2 py-1 rounded bg-gray-200 inline-block my-1">
//                     <b>{msg.sender}:</b> {msg.content}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="flex">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="flex-grow border px-2 py-1 rounded-l"
//               placeholder="Type a message..."
//             />
//             <button
//               onClick={handleSend}
//               className="bg-green-500 text-white px-4 rounded-r"
//             >
//               Send
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import { gql } from "@apollo/client";
// import { v4 as uuidv4 } from "uuid";

// // --- GraphQL Queries & Mutations ---
// const CREATE_CHAT = gql`
//   mutation CreateChat($user_id: uuid!, $title: String!) {
//     insert_chats_one(
//       object: { user_id: $user_id, title: $title }
//       on_conflict: { constraint: unique_user_id, update_columns: [] }
//     ) {
//       id
//       title
//       created_at
//       user_id
//     }
//   }
// `;

// const SEND_MESSAGE = gql`
//   mutation SendMessage($chat_id: uuid!, $user_id: uuid!, $content: String!, $sender: String!) {
//     insert_messages_one(
//       object: { chat_id: $chat_id, user_id: $user_id, content: $content, sender: $sender }
//     ) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// const GET_MESSAGES = gql`
//   query GetMessages($chat_id: uuid!) {
//     messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// export default function Chat() {
//   const [chatId, setChatId] = useState(null);
//   const [input, setInput] = useState("");
//   const [creatingChat, setCreatingChat] = useState(false);

//   // Persistent userId across sessions
//   const [userId] = useState(() => {
//     const saved = sessionStorage.getItem("userId");
//     if (saved) return saved;
//     const newId = uuidv4();
//     sessionStorage.setItem("userId", newId);
//     return newId;
//   });

//   const [createChat] = useMutation(CREATE_CHAT);
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   const { data, loading, refetch } = useQuery(GET_MESSAGES, {
//     variables: { chat_id: chatId },
//     skip: !chatId,
//     pollInterval: 1000,
//   });

//   const handleCreateChat = async () => {
//     if (creatingChat || chatId) return; // prevent double clicks
//     setCreatingChat(true);
//     try {
//       const res = await createChat({
//         variables: { user_id: userId, title: "New Chat" },
//       });
//       setChatId(res.data.insert_chats_one.id);
//     } catch (err) {
//       console.error("Error creating chat:", err);
//     } finally {
//       setCreatingChat(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim() || !chatId) return;
//     try {
//       await sendMessage({
//         variables: {
//           chat_id: chatId,
//           user_id: userId,
//           content: input,
//           sender: "user",
//         },
//       });
//       setInput("");
//       refetch();
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <div className="p-4">
//       {!chatId ? (
//         <button
//           onClick={handleCreateChat}
//           disabled={creatingChat || chatId}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {creatingChat ? "Creating Chat..." : "Start New Chat"}
//         </button>
//       ) : (
//         <>
//           <div className="h-64 overflow-y-auto border p-2 mb-2">
//             {loading ? (
//               <p>Loading messages...</p>
//             ) : (
//               data?.messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={msg.sender === "user" ? "text-right" : "text-left"}
//                 >
//                   <span className="px-2 py-1 rounded bg-gray-200 inline-block my-1">
//                     <b>{msg.sender}:</b> {msg.content}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="flex">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className="flex-grow border px-2 py-1 rounded-l"
//               placeholder="Type a message..."
//             />
//             <button
//               onClick={handleSend}
//               className="bg-green-500 text-white px-4 rounded-r"
//             >
//               Send
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


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
