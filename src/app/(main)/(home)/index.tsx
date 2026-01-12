import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import moment from "moment";

import Avatar from "../../../components/ui/Avatar";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from "../../../constants/theme";
import { useChats } from "../../../hooks/useChats";
import { useAppSelector } from "../../../hooks/useRedux";
import { Chat } from "../../../types/chat";
import { socketService } from "../../../services/socket";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "../../../hooks/useChats";

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: chats, isLoading, refetch } = useChats();
  const onlineUsers = useAppSelector((state) => state.chat.onlineUsers);

  useEffect(() => {
    // Listen for socket events to refetch chats
    const unsubscribeAlert = socketService.on("NEW_MESSAGE_ALERT", () => {
      refetch();
    });

    const unsubscribeRefetch = socketService.on("REFETCH_CHATS", () => {
      refetch();
    });

    return () => {
      unsubscribeAlert();
      unsubscribeRefetch();
    };
  }, []);

  const handleChatPress = (chat: Chat) => {
    router.push(`/(main)/(home)/${chat._id}`);
  };

  const formatLastMessageTime = (time?: string) => {
    if (!time) return "";

    const messageTime = moment(time);
    const now = moment();

    if (now.diff(messageTime, "days") === 0) {
      return messageTime.format("HH:mm");
    } else if (now.diff(messageTime, "days") === 1) {
      return "Yesterday";
    } else if (now.diff(messageTime, "days") < 7) {
      return messageTime.format("ddd");
    } else {
      return messageTime.format("DD/MM/YY");
    }
  };

  const renderChatItem = useCallback(
    ({ item }: { item: Chat }) => {
      const isOnline = item.members.some((member) =>
        onlineUsers.includes(member._id)
      );

      return (
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => handleChatPress(item)}
          activeOpacity={0.7}
        >
          <Avatar
            uri={item.avatar}
            name={item.name}
            size={56}
            online={isOnline && !item.groupChat}
            showOnlineIndicator={!item.groupChat}
          />

          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.lastMessage && (
                <Text style={styles.chatTime}>
                  {formatLastMessageTime(item.lastMessage.createdAt)}
                </Text>
              )}
            </View>

            <View style={styles.chatFooter}>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage?.content || "No messages yet"}
              </Text>
              {item.unreadCount && item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>
                    {item.unreadCount > 99 ? "99+" : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onlineUsers]
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats || []}
        renderItem={renderChatItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={
          chats?.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No chats yet"
            description="Start a conversation to see your chats here"
          />
        }
      />
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
  listContent: {
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  chatContent: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  chatName: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  chatTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    ...typography.caption,
    color: colors.text.primary,
    fontSize: 10,
    fontWeight: "700",
  },
});
