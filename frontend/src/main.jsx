import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./context/auth.jsx";
// import { ClerkProvider } from "@clerk/clerk-react";

// const CLERK_PUBLISHABLE_KEY =
//   import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        {/* <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}> */}
        <App />
        {/* </ClerkProvider> */}
    </AuthProvider>
);