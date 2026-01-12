export interface User {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  password: string;
  bio?: string;
  avatar?: string;
}
