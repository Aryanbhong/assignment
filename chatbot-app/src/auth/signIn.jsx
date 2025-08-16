// import { useState } from "react";
// import { nhost } from "../config/nhost";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSignIn = async (e) => {
//     e.preventDefault();

//     const { error } = await nhost.auth.signIn({
//       email,
//       password,
//     });

//     if (error) {
//       setError(error.message);
//     } else {
//       alert("Sign in successful!");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
//       <h2>Sign In</h2>
//       <form onSubmit={handleSignIn}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ display: "block", marginBottom: "10px", width: "100%" }}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ display: "block", marginBottom: "10px", width: "100%" }}
//         />

//         <button type="submit" style={{ width: "100%" }}>
//           Sign In
//         </button>

//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </form>
//     </div>
//   );
// }


// import { useState } from "react";
// import { nhost } from "../config/nhost";
// import { useNavigate } from "react-router-dom";

// export default function Signin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const handleSignin = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     const { error, session } = await nhost.auth.signIn({ email, password });

//     if (error) {
//       setMessage(`❌ ${error.message}`);
//     } else {
//       setMessage("✅ Sign in successful!");
//       navigate('/chat')
//       console.log("User session:", session);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto" }}>
//       <h2>Sign In</h2>
//       <form onSubmit={handleSignin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Sign In</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }


// import { useState } from "react";
// import { nhost } from "../config/nhost";
// import { useNavigate } from "react-router-dom";

// export default function Signin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleSignin = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     const { error } = await nhost.auth.signIn({ email, password });

//     if (error) {
//       setMessage(`❌ ${error.message}`);
//     } else {
//       setMessage("✅ Sign in successful!");
//       // Redirect after successful login
//       navigate("/chat");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto" }}>
//       <h2>Sign In</h2>
//       <form onSubmit={handleSignin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Sign In</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { nhost } from "../config/nhost";
// import { useNavigate } from "react-router-dom";
// import { useAuthenticationStatus } from "@nhost/react";

// export default function Signin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const { isAuthenticated } = useAuthenticationStatus();

//   // 🔄 Redirect if already logged in
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/chat");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSignin = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     const { error } = await nhost.auth.signIn({ email, password });

//     if (error) {
//       setMessage(`❌ ${error.message}`);
//     } else {
//       setMessage("✅ Sign in successful!");
//       // Redirect after login
//       navigate("/chat");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
//       <h2>Sign In</h2>
//       <form onSubmit={handleSignin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ display: "block", width: "100%", marginBottom: "10px" }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ display: "block", width: "100%", marginBottom: "10px" }}
//         />
//         <button type="submit" style={{ width: "100%", padding: "10px" }}>
//           Sign In
//         </button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { nhost } from "../config/nhost";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-cyan-400/20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-400"
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
          <h2 className="text-2xl font-bold text-gray-100">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to your AI assistant</p>
        </div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
          >
            Sign In
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-3 rounded-lg text-center ${
              message.includes("❌") ? "bg-red-900/50 text-red-300" : "bg-green-900/50 text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}