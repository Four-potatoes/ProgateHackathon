export interface User {
  id: number | null;
  email?: string;
  name: string;
  avatar: string;
  coins?: number;
  isGuest: boolean;
  profilePicture?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token?: string;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  avatar?: string;
}

export interface GuestLoginData {
  name: string;
  avatar?: string;
}
