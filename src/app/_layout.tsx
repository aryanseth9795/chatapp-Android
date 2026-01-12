import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { store } from "../Redux/Store";
import { database } from "../services/database";
import { fileService } from "../services/file";
import { socketService } from "../services/socket";
import { useAppDispatch } from "../hooks/useRedux";
import {
  userExists,
  userNotExists,
  setLoading,
} from "../Redux/slices/AuthSlice";
import { api } from "../services/api";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAuthenticated = store.getState().auth.isAuthenticated;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(main)/(home)");
    }
  }, [isReady, segments]);

  const initializeApp = async () => {
    try {
      dispatch(setLoading(true));

      // Initialize database
      await database.initialize();

      // Initialize file service
      await fileService.initialize();

      // Check authentication
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        // Fetch user data
        try {
          const userData = await api.getMe();
          dispatch(userExists(userData.user));

          // Connect socket
          await socketService.connect();
        } catch (error) {
          console.error("Error fetching user data:", error);
          await SecureStore.deleteItemAsync("token");
          dispatch(userNotExists());
        }
      } else {
        dispatch(userNotExists());
      }
    } catch (error) {
      console.error("App initialization error:", error);
      dispatch(userNotExists());
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
          <Toast />
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
