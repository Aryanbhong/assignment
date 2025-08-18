import { useState } from "react";
import { nhost } from "../config/nhost";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    const { signedUpUser, error } = await nhost.auth.signUp({
      email, 
      password,
      options: {
        displayName,
        redirectTo: "/verify-email" 
      }
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      console.log("User signed up successfully:", signedUpUser);
      setIsSignedUp(true);
    }
  };

  if (isSignedUp) {
    return (
      <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-2xl p-8 border border-neutral-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4"
    />
</svg>

              </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-100">Check Your Email</h2>
            <p className="text-neutral-400 mt-2">
              We've sent a verification link to your email address
            </p>
          </div>

          <div className="mb-8 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
            <p className="text-sm text-neutral-400 mb-2">Verification email sent to:</p>
            <p className="text-lg font-medium text-neutral-200">{email}</p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-medium text-neutral-300">Next steps:</h3>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <span className="mr-2 text-neutral-300">•</span>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-neutral-300">•</span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-neutral-300">•</span>
                <span>Return here to sign in to your account</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setIsSignedUp(false);
                setEmail("");
                setPassword("");
              }}
              className="text-neutral-300 hover:text-neutral-200 transition-colors text-sm"
            >
              Back to Sign Up
            </button>
            <button
              onClick={() => navigate("/sign-in")}
              className="text-neutral-300 hover:text-neutral-200 transition-colors text-sm"
            >
              Already verified? Sign in here
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-2xl p-8 border border-neutral-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-100">Create Account</h2>
          <p className="text-neutral-400 mt-2">Join our platform</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-neutral-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="displayName"
              placeholder="e.g. John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-100 placeholder-neutral-400 transition-all"
            />
          </div>

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
              placeholder="•••••••• (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent text-neutral-100 placeholder-neutral-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-950 to-purple-950 hover:from-blue-900 hover:to-purple-900 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-neutral-900/50"
          >
            Sign Up
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
          Already have an account?{" "}
          <Link to="/sign-in" className="text-neutral-300 hover:text-neutral-200 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}