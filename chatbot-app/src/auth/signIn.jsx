import { useState, useEffect } from "react";
import { nhost } from "../config/nhost";
import { useNavigate, Link } from "react-router-dom";
import { useAuthenticationStatus } from "@nhost/react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthenticationStatus();

  // 🔄 Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);
  const handleSignin = async (e) => {
    e.preventDefault();
    setMessage("");

    const { error } = await nhost.auth.signIn({ email, password });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage("✅ Sign in successful!");
      // Redirect after login
      navigate("/chat");
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center p-4"> {/* Darkest background */}
      <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-2xl p-8 border border-neutral-700"> {/* Dark card background, subtle border */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center"> {/* Darker circle background */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-300" // Muted icon color
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-100">Welcome Back</h2>
          <p className="text-neutral-400 mt-2">Sign in to your AI assistant</p>
        </div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-100 placeholder-neutral-400 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-100 placeholder-neutral-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-950 to-purple-950 hover:from-blue-900 hover:to-purple-900 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-neutral-900/50"
          >
            Sign In
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-3 rounded-lg text-center ${
           message.includes("❌") ? "bg-red-950/50 text-red-500" : "bg-green-950/50 text-green-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-neutral-300 hover:text-neutral-200 transition-colors">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}


