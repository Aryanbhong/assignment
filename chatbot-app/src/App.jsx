

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthenticationStatus } from "@nhost/react";
import SignIn from "./auth/signIn";
import SignUp from "./auth/signUp";
import Chat from "./components/Chat";


export default function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    
  
        <Routes>
          {/* Public routes */}
          <Route path="/sign-in" element={!isAuthenticated ? <SignIn /> : <Navigate to="/chat" replace />} />
          <Route path="/sign-up" element={!isAuthenticated ? <SignUp /> : <Navigate to="/chat" replace />} />
          
          {/* Protected route */}
          <Route 
            path="/chat" 
            element={isAuthenticated ? <Chat /> : <Navigate to="/sign-in" replace />} 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/chat" : "/sign-in"} replace />} 
          />
        </Routes>
        
   
  );
}
