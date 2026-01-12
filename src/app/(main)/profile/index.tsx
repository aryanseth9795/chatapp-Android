import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

import Avatar from "../../../components/ui/Avatar";
import Button from "../../../components/ui/Button";
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from "../../../constants/theme";
import { useAppSelector, useAppDispatch } from "../../../hooks/useRedux";
import { logout } from "../../../Redux/slices/AuthSlice";
import { api } from "../../../services/api";
import { socketService } from "../../../services/socket";
import { database } from "../../../services/database";

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await api.logout();
            socketService.disconnect();
            dispatch(logout());

            Toast.show({
              type: "success",
              text1: "Logged out successfully",
            });

            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  const handleClearCache = async () => {
    Alert.alert(
      "Clear Cache",
      "This will delete all cached messages and media files. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await database.clearAllData();
              Toast.show({
                type: "success",
                text1: "Cache cleared successfully",
              });
            } catch (error) {
              console.error("Clear cache error:", error);
              Toast.show({
                type: "error",
                text1: "Failed to clear cache",
              });
            }
          },
        },
      ]
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar uri={user.avatar} name={user.name} size={100} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleClearCache}>
            <Text style={styles.optionText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
          />
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ChatsApp v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  username: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  bio: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.md,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  section: {
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  optionText: {
    ...typography.body,
    color: colors.text.primary,
  },
  footer: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
