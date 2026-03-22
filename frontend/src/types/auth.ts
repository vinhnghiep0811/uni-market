export type User = {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    facebookLink?: string | null;
    avatarUrl?: string | null;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    fullName: string;
    email: string;
    password: string;
};

export type AuthResponse = {
    user: User;
    ok?: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  facebookLink?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  provider?: "GOOGLE" | "LOCAL";
  providerId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GoogleLoginResponse = {
  ok: true;
  user: AuthUser;
  accessToken: string;
};