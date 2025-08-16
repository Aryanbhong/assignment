// // import  { Route,Routes } from 'react-router-dom'
// // import Signup from './auth/signUp'
// // import SignIn from './auth/signIn'
// // import Chat from './components/Chat'

// // function App() {
  
 
// //   return (
   

  
// //     <Routes>
// //       <Route path='/sign-up' element={<Signup/>}/>
// //       <Route path='/sign-in' element={<SignIn/>}/>
// //       <Route path='/chat' element={ <Chat />}/>
// //     </Routes>
// //   )
// // }

// // export default App


// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { useState } from "react";
// import Signup from "./auth/signUp";
// import SignIn from "./auth/signIn";
// import Chat from "./components/Chat";

// function App() {
//   // For now use local state (later can integrate JWT / nhost auth etc.)
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
//       <Routes>
//         {/* Default route → if logged in, go to chat, else sign-in */}
//         <Route
//           path="/"
//           element={isAuthenticated ? <Navigate to="/chat" /> : <Navigate to="/sign-in" />}
//         />

//         <Route path="/sign-up" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
//         <Route path="/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />

//         {/* Protected Chat Route */}
//         <Route
//           path="/chat"
//           element={ <Chat />}
//         />
//       </Routes>
  
//   );
// }

// export default App;


// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import { useState } from "react";
// import Signup from "./auth/signUp";
// import SignIn from "./auth/signIn";
// import Chat from "./components/Chat";

// function App() {
//   // For now using local state (later replace with nhost.auth.isAuthenticated)
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   return (
  
//       <Routes>
//         {/* Default route → if logged in, go to chat, else sign-in */}
//         <Route
//           path="/"
//           element={
//             isAuthenticated ? <Navigate to="/chat" /> : <Navigate to="/sign-in" />
//           }
//         />

//         {/* Auth Routes */}
//         <Route
//           path="/sign-up"
//           element={<Signup setIsAuthenticated={setIsAuthenticated} />}
//         />
//         <Route
//           path="/sign-in"
//           element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
//         />

//         {/* Protected Chat Route */}
//         <Route
//           path="/chat"
//           element={
//             isAuthenticated ? (
//               <Chat />
//             ) : (
//               <Navigate to="/sign-in" />
//             )
//           }
//         />
//       </Routes>
   
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useAuthenticationStatus } from "@nhost/react";
// import Signup from "./auth/Signup";
// import Signin from "./auth/Signin";
// import Chat from "./components/Chat";

// function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuthenticationStatus();

//   if (isLoading) return <p>Loading...</p>;
//   return isAuthenticated ? children : <Navigate to="/sign-in" />;
// }

// function App() {
//   const { isAuthenticated, isLoading } = useAuthenticationStatus();

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   return (
//       <Routes>
//         {/* Default route */}
//         <Route
//           path="/"
//           element={
//             isAuthenticated ? <Navigate to="/chat" /> : <Navigate to="/sign-in" />
//           }
//         />

//         {/* Auth routes */}
//         <Route path="/sign-up" element={<Signup />} />
//         <Route
//           path="/sign-in"
//           element={isAuthenticated ? <Navigate to="/chat" /> : <Signin />}
//         />

//         {/* Protected Chat route */}
//         <Route
//           path="/chat"
//           element={<Chat/>}
//         />
//       </Routes>
  
//   );
// }

// export default App;
;


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useAuthenticationStatus } from "@nhost/react";
// import SignIn from "./auth/signIn";
// import SignUp from "./auth/signUp"
// import Chat from "./components/Chat";

// export default function App() {
//   const { isAuthenticated, isLoading } = useAuthenticationStatus();

//   if (isLoading) return <p>Loading...</p>;

//   return (
 
//       <Routes>
//        <Route path="/sign-in" element={<SignIn/>}/>
//        <Route path="sign-up " element={<SignUp/>}/>
//        <Route path="/chat" element={<Chat/>}/>
//       </Routes>
   
//   );
// }

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
