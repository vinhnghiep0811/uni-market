import { apiRequest, setAccessToken, clearAccessToken } from "./api";
import { GoogleLoginResponse, AuthUser, UpdateProfilePayload } from "@/types/auth";

export async function loginWithGoogle(idToken: string) {
  const res = await apiRequest<GoogleLoginResponse>("/auth/google", {
    method: "POST",
    body: { idToken },
  });
  setAccessToken(res.accessToken);
  return res
}

export async function getMe() {
  return apiRequest<AuthUser>("/auth/me");
}

export async function logout() {
  await apiRequest("/auth/logout", { method: "POST" });
  clearAccessToken();
}

export async function updateProfile(payload: UpdateProfilePayload) {
  return apiRequest<AuthUser>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}
