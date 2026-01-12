import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  colors,
  gradients,
  spacing,
  typography,
  borderRadius,
} from "../../constants/theme";
import { useAppDispatch } from "../../hooks/useRedux";
import { userExists } from "../../Redux/slices/AuthSlice";
import { api } from "../../services/api";
import { socketService } from "../../services/socket";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.login(username.trim(), password);

      dispatch(userExists(response.user));

      // Connect socket
      await socketService.connect();

      Toast.show({
        type: "success",
        text1: "Welcome back!",
        text2: `Hi ${response.user.name}`,
      });

      router.replace("/(main)/(home)");
    } catch (error: any) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.background.primary, colors.background.secondary]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logo}
            >
              <Text style={styles.logoText}>C</Text>
            </LinearGradient>
            <Text style={styles.title}>ChatsApp</Text>
            <Text style={styles.subtitle}>Connect with friends instantly</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              leftIcon="person"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed"
            />

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.loginButton}
            />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerTextBold}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.text.primary,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerLink: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  registerText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  registerTextBold: {
    color: colors.primary[400],
    fontWeight: "600",
  },
});
