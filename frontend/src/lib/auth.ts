import { apiRequest } from "./api";
import { GoogleLoginResponse, AuthUser } from "@/types/auth";

export async function loginWithGoogle(idToken: string) {
  return apiRequest<GoogleLoginResponse>("/auth/google", {
    method: "POST",
    body: { idToken },
  });
}

export async function getMe() {
  return apiRequest<AuthUser>("/auth/me");
}

export async function logout() {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}