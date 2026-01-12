import axios, { AxiosInstance, AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../constants/config";
import Toast from "react-native-toast-message";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 150000,
      withCredentials: true, // Enable cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token as cookie
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await SecureStore.getItemAsync("token");
          if (token) {
            // Send token in Cookie header
            config.headers.Cookie = `token=${token}`;
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              // Unauthorized - clear token and redirect to login
              await SecureStore.deleteItemAsync("token");
              Toast.show({
                type: "error",
                text1: "Session Expired",
                text2: "Please login again",
              });
              break;
            case 403:
              Toast.show({
                type: "error",
                text1: "Access Denied",
                text2: data?.message || "You do not have permission",
              });
              break;
            case 404:
              Toast.show({
                type: "error",
                text1: "Not Found",
                text2: data?.message || "Resource not found",
              });
              break;
            case 500:
              Toast.show({
                type: "error",
                text1: "Server Error",
                text2: "Something went wrong. Please try again",
              });
              break;
            default:
              if (data?.message) {
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: data.message,
                });
              }
          }
        } else if (error.request) {
          Toast.show({
            type: "error",
            text1: "Network Error",
            text2: "Please check your internet connection",
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const response = await this.api.post("/users/login", {
      username,
      password,
    });
    if (response.data?.token) {
      await SecureStore.setItemAsync("token", response.data.token);
    }
    return response.data;
  }

  async register(data: {
    name: string;
    username: string;
    password: string;
    bio?: string;
    avatar?: string;
  }) {
    const response = await this.api.post("/users/signup", data);
    if (response.data?.token) {
      await SecureStore.setItemAsync("token", response.data.token);
    }
    return response.data;
  }

  async logout() {
    await this.api.post("/users/logout");
    await SecureStore.deleteItemAsync("token");
  }

  async getMe() {
    const response = await this.api.get("/users/me");
    return response.data;
  }

  // Chat endpoints
  async getMyChats() {
    const response = await this.api.get("/chat/my");
    return response.data;
  }

  async getChatDetails(chatId: string) {
    const response = await this.api.get(`/chat/${chatId}`);
    return response.data;
  }

  async createGroupChat(data: { name: string; members: string[] }) {
    const response = await this.api.post("/chat/new", data);
    return response.data;
  }

  async addGroupMembers(chatId: string, members: string[]) {
    const response = await this.api.put(`/chat/addmembers`, {
      chatId,
      members,
    });
    return response.data;
  }

  async removeGroupMember(chatId: string, userId: string) {
    const response = await this.api.put(`/chat/removemember`, {
      chatId,
      userId,
    });
    return response.data;
  }

  async leaveGroup(chatId: string) {
    const response = await this.api.delete(`/chat/leave/${chatId}`);
    return response.data;
  }

  // Message endpoints
  async getMessages(chatId: string, page: number = 1) {
    const response = await this.api.get(`/chat/message/${chatId}?page=${page}`);
    return response.data;
  }

  async sendMessage(chatId: string, content: string) {
    const response = await this.api.post("/chat/message", { chatId, content });
    return response.data;
  }

  async sendAttachments(formData: FormData) {
    const response = await this.api.post("/chat/message", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Search
  async searchUsers(name: string) {
    const response = await this.api.get(
      `/users/search?name=${encodeURIComponent(name)}`
    );
    return response.data;
  }

  // Notifications
  async getNotifications() {
    const response = await this.api.get("/users/notifications");
    return response.data;
  }

  async sendFriendRequest(userId: string) {
    const response = await this.api.put("/users/sendrequest", { userId });
    return response.data;
  }

  async acceptFriendRequest(requestId: string, accept: boolean) {
    const response = await this.api.put("/users/acceptrequest", {
      requestId,
      accept,
    });
    return response.data;
  }

  // Profile
  async updateProfile(data: { name?: string; bio?: string; avatar?: string }) {
    const response = await this.api.put("/users/profile", data);
    return response.data;
  }

  // Generic request method
  async request(config: any) {
    return this.api.request(config);
  }

  getAxiosInstance() {
    return this.api;
  }
}

export const api = new ApiService();
export default api;
