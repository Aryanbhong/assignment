
// import React, { useState, useEffect } from "react";
// import { gql, useMutation, useSubscription } from "@apollo/client";
// import { v4 as uuidv4 } from "uuid";

// // ✅ GraphQL subscription for live messages
// const GET_MESSAGES = gql`
//   subscription GetMessages($chat_id: uuid!) {
//     messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
//       id
//       chat_id
//       sender
//       content
//       created_at
//     }
//   }
// `;

// // ✅ GraphQL mutation for sending a message
// const SEND_MESSAGE = gql`
//   mutation InsertMessage($chat_id: uuid!, $content: String!) {
//     insert_messages_one(object: { chat_id: $chat_id, content: $content, sender: "user" }) {
//       id
//       chat_id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// const Chat = () => {
//   const [chatId, setChatId] = useState(null);
//   const [message, setMessage] = useState("");

//   // Generate or load chatId
//   useEffect(() => {
//     let storedChatId = localStorage.getItem("chat_id");
//     if (!storedChatId) {
//       storedChatId = uuidv4();
//       localStorage.setItem("chat_id", storedChatId);
//     }
//     setChatId(storedChatId);
//   }, []);

//   // Subscribe to messages
//   const { data, loading, error } = useSubscription(GET_MESSAGES, {
//     variables: { chat_id: chatId },
//     skip: !chatId,
//   });

//   // Mutation hook
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   // Send message handler
//   const handleSend = async () => {
//     if (!message.trim() || !chatId) return;

//     try {
//       await sendMessage({
//         variables: { chat_id: chatId, content: message },
//       });
//       setMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   if (!chatId) return <p>Setting up chat...</p>;
//   if (loading) return <p>Loading messages...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div style={{ padding: "1rem" }}>
//       {/* Chat Messages */}
//       <div style={{ height: "400px", overflowY: "auto", marginBottom: "1rem", border: "1px solid #ccc", padding: "0.5rem" }}>
//         {data?.messages.map((msg) => (
//           <div key={msg.id} style={{ margin: "0.5rem 0" }}>
//             <b>{msg.sender}:</b> {msg.content}
//           </div>
//         ))}
//       </div>

//       {/* Input */}
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message..."
//         style={{ padding: "0.5rem", width: "70%", marginRight: "0.5rem" }}
//       />
//       <button onClick={handleSend} style={{ padding: "0.5rem" }}>
//         Send
//       </button>
//     </div>
//   );
// };

// export default Chat;


// import { useParams } from "react-router-dom";
// import { useQuery, useSubscription, useMutation } from "@apollo/client";
// import { GET_MESSAGES, MESSAGES_SUBSCRIPTION, SEND_MESSAGE } from "../config/graphQl";
// import { useState } from "react";

// export default function Chat() {
//   const { id } = useParams();
//   const [message, setMessage] = useState("");

//   const { data } = useSubscription(MESSAGES_SUBSCRIPTION, {
//     variables: { chat_id: id }
//   });

//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     await sendMessage({
//       variables: { chat_id: id, content: message }
//     });

//     setMessage("");
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <div className="flex-1 overflow-y-auto p-4">
//         {data?.messages?.map(msg => (
//           <div key={msg.id} className={`mb-2 ${msg.sender === "bot" ? "text-blue-600" : "text-gray-800"}`}>
//             <span className="font-bold">{msg.sender}: </span>
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSend} className="p-2 border-t flex">
//         <input
//           className="flex-1 border p-2 rounded"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Send</button>
//       </form>
//     </div>
//   );
// }


// // import { useState } from "react";
// // import { nhost } from "../config/nhost";

// // export default function Signin() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [message, setMessage] = useState("");

// //   const handleSignin = async (e) => {
// //     e.preventDefault();
// //     setMessage("");

// //     const { error } = await nhost.auth.signIn({ email, password });

// //     if (error) {
// //       setMessage(`❌ ${error.message}`);
// //     } else {
// //       setMessage("✅ Sign in successful!");
// //     }
// //   };

// //   return (
// //     <div style={{ maxWidth: "400px", margin: "auto" }}>
// //       <h2>Sign In</h2>
// //       <form onSubmit={handleSignin}>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //         />
// //         <button type="submit">Sign In</button>
// //       </form>
// //       {message && <p>{message}</p>}
// //     </div>
// //   );
// // }



// import { useState } from "react";
// import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
// import { nhost } from "../config/nhost";

// // Queries (keep your existing GraphQL queries the same)
// const GET_CHATS = gql`
//   query GetChats {
//     chats(order_by: { created_at: desc }) {
//       id
//       title
//     }
//   }
// `;

// const GET_MESSAGES = gql`
//   subscription GetMessages($chatId: uuid!) {
//     messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// // Mutations (keep your existing mutations the same)
// const CREATE_CHAT = gql`
//   mutation CreateChat($title: String!) {
//     insert_chats_one(object: { title: $title }) {
//       id
//       title
//     }
//   }
// `;

// const SEND_MESSAGE = gql`
//   mutation SendMessage($chatId: uuid!, $content: String!) {
//     sendMessage(chat_id: $chatId, content: $content) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// export default function Chat() {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [newChatTitle, setNewChatTitle] = useState("");

//   // Queries and mutations (keep your existing logic)
//   const { data: chatsData, refetch: refetchChats } = useQuery(GET_CHATS);
//   const { data: messagesData } = useSubscription(GET_MESSAGES, {
//     variables: { chatId: selectedChat },
//     skip: !selectedChat,
//   });

//   const [createChat] = useMutation(CREATE_CHAT);
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   const handleCreateChat = async () => {
//     if (!newChatTitle.trim()) return;
//     await createChat({ variables: { title: newChatTitle } });
//     setNewChatTitle("");
//     refetchChats();
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat) return;
//     await sendMessage({ variables: { chatId: selectedChat, content: newMessage } });
//     setNewMessage("");
//   };

//   const handleLogout = async () => {
//     await nhost.auth.signOut();
//     window.location.href = "/sign-in";
//   };

//   return (
//     <div className="flex h-screen bg-gray-900 text-gray-100">
//       {/* Sidebar: Chat List */}
//       <div className="w-1/4 border-r border-gray-700 bg-gray-800 p-4 flex flex-col">
//         <h3 className="text-xl font-bold text-cyan-400 mb-4">Your Chats</h3>
        
//         <div className="flex-1 overflow-y-auto">
//           {chatsData?.chats.map((chat) => (
//             <div
//               key={chat.id}
//               className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
//                 selectedChat === chat.id 
//                   ? "bg-cyan-900/50 border border-cyan-400/30" 
//                   : "hover:bg-gray-700"
//               }`}
//               onClick={() => setSelectedChat(chat.id)}
//             >
//               <div className="font-medium">{chat.title}</div>
//               <div className="text-xs text-gray-400">
//                 {new Date(chat.created_at).toLocaleString()}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* New Chat */}
//         <div className="mt-4">
//           <input
//             type="text"
//             placeholder="New Chat Title"
//             value={newChatTitle}
//             onChange={(e) => setNewChatTitle(e.target.value)}
//             className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-100 placeholder-gray-400 mb-2"
//           />
//           <button
//             onClick={handleCreateChat}
//             className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all"
//           >
//             Create Chat
//           </button>
//         </div>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Main Chat Window */}
//       <div className="flex-1 flex flex-col p-4 bg-gray-900">
//         {selectedChat ? (
//           <>
//             <div className="flex-1 overflow-y-auto mb-4 space-y-4">
//               {messagesData?.messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${
//                     msg.sender === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
//                       msg.sender === "user"
//                         ? "bg-cyan-600 text-white"
//                         : "bg-gray-700 text-gray-100"
//                     }`}
//                   >
//                     <div className="font-medium">
//                       {msg.sender === "user" ? "You" : "AI Assistant"}
//                     </div>
//                     <div className="mt-1">{msg.content}</div>
//                     <div className="text-xs opacity-70 mt-1">
//                       {new Date(msg.created_at).toLocaleTimeString()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Message Input */}
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 placeholder="Type your message..."
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                 className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-100 placeholder-gray-400"
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-400">
//             <div className="text-center">
//               <div className="w-16 h-16 mx-auto mb-4 text-cyan-400">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//               </div>
//               <p className="text-xl">Select a chat to start messaging</p>
//               <p className="text-sm mt-2">or create a new chat</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useQuery, useMutation, gql } from "@apollo/client";
// import { useUserId, useUserData } from "@nhost/react";

// const GET_CHATS = gql`
//   query GetChats($user_id: uuid!) {
//     chats(where: { user_id: { _eq: $user_id } }, order_by: { created_at: desc }) {
//       id
//       title
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

// const CREATE_CHAT = gql`
//   mutation CreateChat($user_id: uuid!, $title: text) {
//     insert_chats_one(object: { user_id: $user_id, title: $title }) {
//       id
//       title
//       created_at
//     }
//   }
// `;

// const SEND_MESSAGE = gql`
//   mutation SendMessage($chat_id: uuid!, $user_id: uuid, $content: text!, $sender: text) {
//     insert_messages_one(object: { chat_id: $chat_id, user_id: $user_id, content: $content, sender: $sender }) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// export default function Chat() {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState("");

//   const userId = useUserId();
//   const user = useUserData();

//   const { data: chatsData, refetch: refetchChats } = useQuery(GET_CHATS, {
//     variables: { user_id: userId },
//     skip: !userId,
//   });

//   const { data: messagesData, refetch: refetchMessages } = useQuery(GET_MESSAGES, {
//     variables: { chat_id: selectedChat },
//     skip: !selectedChat,
//   });

//   const [createChat] = useMutation(CREATE_CHAT);
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   const handleCreateChat = async () => {
//     const res = await createChat({
//       variables: { user_id: userId, title: "New Chat" },
//     });
//     setSelectedChat(res.data.insert_chats_one.id);
//     refetchChats();
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedChat) return;

//     await sendMessage({
//       variables: {
//         chat_id: selectedChat,
//         user_id: userId,
//         content: message,
//         sender: user?.email || "user",
//       },
//     });

//     setMessage("");
//     refetchMessages();
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar with Chats */}
//       <div className="w-1/3 bg-gray-100 p-4">
//         <button
//           onClick={handleCreateChat}
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//         >
//           + New Chat
//         </button>
//         <ul>
//           {chatsData?.chats.map((chat) => (
//             <li
//               key={chat.id}
//               className={`p-2 cursor-pointer rounded ${
//                 selectedChat === chat.id ? "bg-blue-200" : "hover:bg-gray-200"
//               }`}
//               onClick={() => setSelectedChat(chat.id)}
//             >
//               {chat.title || "Untitled Chat"}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 overflow-y-auto p-4">
//           {messagesData?.messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`p-2 my-2 rounded ${
//                 msg.sender === user?.email ? "bg-green-200 ml-auto" : "bg-gray-300 mr-auto"
//               } w-fit`}
//             >
//               <p>{msg.content}</p>
//               <small className="text-xs text-gray-600">{msg.sender}</small>
//             </div>
//           ))}
//         </div>
//         <div className="p-4 flex">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="flex-1 border p-2 rounded"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useQuery, useMutation, gql } from "@apollo/client";
// import { useUserData } from "@nhost/react";

// // ✅ Query chats (Hasura will auto-filter by logged in user)
// const GET_CHATS = gql`
//   query GetChats {
//     chats(order_by: { created_at: desc }) {
//       id
//       title
//       created_at
//     }
//   }
// `;

// // ✅ Query messages by chat
// const GET_MESSAGES = gql`
//   query GetMessages($chat_id: uuid!) {
//     messages(
//       where: { chat_id: { _eq: $chat_id } }
//       order_by: { created_at: asc }
//     ) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// // ✅ Create a chat (no user_id, Hasura auto-inserts it)
// const CREATE_CHAT = gql`
//   mutation CreateChat($title: String) {
//     insert_chats_one(object: { title: $title }) {
//       id
//       title
//       created_at
//     }
//   }
// `;

// // ✅ Send a message
// const SEND_MESSAGE = gql`
//   mutation SendMessage($chat_id: uuid!, $content: String!, $sender: String) {
//     insert_messages_one(
//       object: { chat_id: $chat_id, content: $content, sender: $sender }
//     ) {
//       id
//       content
//       sender
//       created_at
//     }
//   }
// `;

// export default function Chat() {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState("");

//   const user = useUserData();

//   const { data: chatsData, refetch: refetchChats } = useQuery(GET_CHATS);

//   const { data: messagesData, refetch: refetchMessages } = useQuery(
//     GET_MESSAGES,
//     {
//       variables: { chat_id: selectedChat },
//       skip: !selectedChat,
//     }
//   );

//   const [createChat] = useMutation(CREATE_CHAT);
//   const [sendMessage] = useMutation(SEND_MESSAGE);

//   // ✅ Create new chat
//   const handleCreateChat = async () => {
//     const res = await createChat({
//       variables: { title: "New Chat" },
//     });
//     setSelectedChat(res.data.insert_chats_one.id);
//     refetchChats();
//   };

//   // ✅ Send message
//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedChat) return;

//     await sendMessage({
//       variables: {
//         chat_id: selectedChat,
//         content: message,
//         sender: user?.email || "user",
//       },
//     });

//     setMessage("");
//     refetchMessages();
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar with Chats */}
//       <div className="w-1/3 bg-gray-100 p-4">
//         <button
//           onClick={handleCreateChat}
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//         >
//           + New Chat
//         </button>
//         <ul>
//           {chatsData?.chats.map((chat) => (
//             <li
//               key={chat.id}
//               className={`p-2 cursor-pointer rounded ${
//                 selectedChat === chat.id
//                   ? "bg-blue-200"
//                   : "hover:bg-gray-200"
//               }`}
//               onClick={() => setSelectedChat(chat.id)}
//             >
//               {chat.title || "Untitled Chat"}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 overflow-y-auto p-4">
//           {messagesData?.messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`p-2 my-2 rounded ${
//                 msg.sender === user?.email
//                   ? "bg-green-200 ml-auto"
//                   : "bg-gray-300 mr-auto"
//               } w-fit`}
//             >
//               <p>{msg.content}</p>
//               <small className="text-xs text-gray-600">{msg.sender}</small>
//             </div>
//           ))}
//         </div>
//         <div className="p-4 flex">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="flex-1 border p-2 rounded"
//             placeholder="Type a message..."
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

// --- GraphQL Queries & Mutations ---

// ✅ Mutation to create a new chat
const CREATE_CHAT = gql`
  mutation CreateChat($title: String) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
    }
  }
`;

// ✅ Mutation to insert message
const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $user_id: uuid!, $content: String!, $sender: String!) {
    insert_messages_one(object: { chat_id: $chat_id, user_id: $user_id, content: $content, sender: $sender }) {
      id
      content
      sender
      created_at
    }
  }
`;

// ✅ Query to fetch messages in a chat
const GET_MESSAGES = gql`
  query GetMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      content
      sender
      created_at
    }
  }
`;

export default function Chat({ userId }) {
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const [creatingChat, setCreatingChat] = useState(false);

  const [createChat] = useMutation(CREATE_CHAT);
  const [sendMessage] = useMutation(SEND_MESSAGE);

  // Load messages if chatId is set
  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { chat_id: chatId },
    skip: !chatId, // don’t run query until chat exists
    pollInterval: 1000, // auto refresh messages
  });

  // ✅ Create chat safely (no duplicate inserts)
  const handleCreateChat = async () => {
    if (creatingChat || chatId) return; // prevent duplicates
    setCreatingChat(true);
    try {
      const res = await createChat({ variables: { title: "New Chat" } });
      setChatId(res.data.insert_chats_one.id);
    } catch (err) {
      console.error("Error creating chat:", err);
    } finally {
      setCreatingChat(false);
    }
  };

  // ✅ Send a message
  const handleSend = async () => {
    if (!input.trim() || !chatId) return;
    try {
      await sendMessage({
        variables: {
          chat_id: chatId,
          user_id: userId,
          content: input,
          sender: "user",
        },
      });
      setInput(""); // clear input
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="p-4">
      {!chatId ? (
        <button onClick={handleCreateChat} disabled={creatingChat} className="bg-blue-500 text-white px-4 py-2 rounded">
          {creatingChat ? "Creating Chat..." : "Start New Chat"}
        </button>
      ) : (
        <>
          <div className="h-64 overflow-y-auto border p-2 mb-2">
            {loading ? (
              <p>Loading messages...</p>
            ) : (
              data?.messages.map((msg) => (
                <div key={msg.id} className={msg.sender === "user" ? "text-right" : "text-left"}>
                  <span className="px-2 py-1 rounded bg-gray-200 inline-block my-1">
                    <b>{msg.sender}:</b> {msg.content}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border px-2 py-1 rounded-l"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="bg-green-500 text-white px-4 rounded-r">
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
