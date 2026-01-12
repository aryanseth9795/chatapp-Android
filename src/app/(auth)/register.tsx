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
import { colors, gradients, spacing, typography } from "../../constants/theme";
import { useAppDispatch } from "../../hooks/useRedux";
import { userExists } from "../../Redux/slices/AuthSlice";
import { api } from "../../services/api";
import { socketService } from "../../services/socket";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRegister = async () => {
    if (!name.trim() || !username.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all required fields",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.register({
        name: name.trim(),
        username: username.trim(),
        password,
        bio: bio.trim() || undefined,
      });

      dispatch(userExists(response.user));

      // Connect socket
      await socketService.connect();

      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: `Welcome ${response.user.name}`,
      });

      router.replace("/(main)/(home)");
    } catch (error: any) {
      console.error("Register error:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.response?.data?.message || "Something went wrong",
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ChatsApp today</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Name *"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              leftIcon="person"
            />

            <Input
              label="Username *"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              leftIcon="at"
            />

            <Input
              label="Password *"
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock-closed"
            />

            <Input
              label="Bio (Optional)"
              placeholder="Tell us about yourself"
              value={bio}
              onChangeText={setBio}
              leftIcon="information-circle"
              multiline
              numberOfLines={3}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              fullWidth
              style={styles.registerButton}
            />

            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginTextBold}>Login</Text>
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
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  form: {
    width: "100%",
  },
  registerButton: {
    marginTop: spacing.md,
  },
  loginLink: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  loginText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  loginTextBold: {
    color: colors.primary[400],
    fontWeight: "600",
  },
});
