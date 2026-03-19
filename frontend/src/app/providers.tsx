"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("Missing GOOGLE CLIENT ID");
  }

  return (
    <GoogleOAuthProvider clientId={clientId} locale="en"> 
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}