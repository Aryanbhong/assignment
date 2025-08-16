import { useQuery } from "@apollo/client";
import { GET_CHATS } from "../graphql";
import { Link } from "react-router-dom";

export default function Chats() {
  const { data, loading } = useQuery(GET_CHATS);

  if (loading) return <p>Loading chats...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">My Chats</h1>
      {data.chats.map(chat => (
        <Link key={chat.id} to={`/chat/${chat.id}`} className="block p-2 border-b">
          {chat.title}
        </Link>
      ))}
    </div>
  );
}
