import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ActionSheetIOS,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import Avatar from "../../../components/ui/Avatar";
import MessageBubble from "../../../components/ui/MessageBubble";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import {
  colors,
  spacing,
  typography,
  borderRadius,
} from "../../../constants/theme";
import {
  useMessages,
  useSendMessage,
  useSendAttachments,
  useChatDetails,
} from "../../../hooks/useChats";
import { useAppSelector } from "../../../hooks/useRedux";
import { socketService } from "../../../services/socket";
import { fileService } from "../../../services/file";
import { Message } from "../../../types/chat";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();

  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = useAppSelector((state) => state.auth.user);
  const onlineUsers = useAppSelector((state) => state.chat.onlineUsers);

  const { data: chatDetails } = useChatDetails(chatId || "");
  const { data: messages, isLoading, refetch } = useMessages(chatId || "");
  const sendMessageMutation = useSendMessage();
  const sendAttachmentsMutation = useSendAttachments();

  useEffect(() => {
    if (chatId) {
      socketService.joinChat(chatId);

      // Listen for new messages
      const unsubscribeMessage = socketService.on(
        "NEW_MESSAGE",
        (data: any) => {
          if (data.chatId === chatId) {
            refetch();
          }
        }
      );

      // Listen for typing indicators
      const unsubscribeStartTyping = socketService.on(
        "START_TYPING",
        (data: any) => {
          if (data.chatId === chatId && data.user._id !== currentUser?._id) {
            setTypingUsers((prev) => [...new Set([...prev, data.user.name])]);
          }
        }
      );

      const unsubscribeStopTyping = socketService.on(
        "STOP_TYPING",
        (data: any) => {
          if (data.chatId === chatId) {
            setTypingUsers((prev) =>
              prev.filter((name) => name !== data.user.name)
            );
          }
        }
      );

      return () => {
        socketService.leaveChat(chatId);
        unsubscribeMessage();
        unsubscribeStartTyping();
        unsubscribeStopTyping();
      };
    }
  }, [chatId, currentUser]);

  const handleTyping = (text: string) => {
    setMessageText(text);

    if (!isTyping && text.trim().length > 0) {
      setIsTyping(true);
      socketService.startTyping(chatId || "");
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.stopTyping(chatId || "");
    }, 2000);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || !chatId) return;

    setMessageText("");
    setIsTyping(false);
    socketService.stopTyping(chatId);

    try {
      await sendMessageMutation.mutateAsync({
        chatId,
        content: trimmedMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send message",
        text2: "Please try again",
      });
    }
  };

  const handleAttachmentPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Cancel",
            "Take Photo",
            "Choose from Gallery",
            "Choose Document",
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleTakePhoto();
          else if (buttonIndex === 2) handleChooseImage();
          else if (buttonIndex === 3) handleChooseDocument();
        }
      );
    } else {
      Alert.alert("Send Attachment", "Choose an option", [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: handleTakePhoto },
        { text: "Choose from Gallery", onPress: handleChooseImage },
        { text: "Choose Document", onPress: handleChooseDocument },
      ]);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const file = await fileService.takePhoto();
      if (file) await uploadFile(file);
    } catch (error) {
      console.error("Error taking photo:", error);
      Toast.show({ type: "error", text1: "Failed to access camera" });
    }
  };

  const handleChooseImage = async () => {
    try {
      const file = await fileService.pickImage();
      if (file) await uploadFile(file);
    } catch (error) {
      console.error("Error choosing image:", error);
      Toast.show({ type: "error", text1: "Failed to choose image" });
    }
  };

  const handleChooseDocument = async () => {
    try {
      const file = await fileService.pickDocument();
      if (file) await uploadFile(file);
    } catch (error) {
      console.error("Error choosing document:", error);
      Toast.show({ type: "error", text1: "Failed to choose document" });
    }
  };

  const uploadFile = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("files", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      await sendAttachmentsMutation.mutateAsync(formData);

      Toast.show({
        type: "success",
        text1: "File sent successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      Toast.show({
        type: "error",
        text1: "Failed to send file",
      });
    }
  };

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isMine = item.sender._id === currentUser?._id;

      return (
        <MessageBubble
          content={item.content}
          timestamp={item.createdAt}
          isMine={isMine}
          senderName={!isMine ? item.sender.name : undefined}
          attachments={item.attachments}
          onAttachmentPress={(url) => {
            // Handle attachment press - could open in browser or download
            console.log("Attachment pressed:", url);
          }}
        />
      );
    },
    [currentUser]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  const isUserOnline =
    chatDetails &&
    !chatDetails.groupChat &&
    chatDetails.members.some((member) => onlineUsers.includes(member._id));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <Avatar
          uri={chatDetails?.avatar}
          name={chatDetails?.name || "Chat"}
          size={40}
          online={isUserOnline}
          showOnlineIndicator={!chatDetails?.groupChat}
        />

        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {chatDetails?.name}
          </Text>
          {typingUsers.length > 0 ? (
            <Text style={styles.headerStatus}>
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing...`
                : "Multiple users typing..."}
            </Text>
          ) : (
            <Text style={styles.headerStatus}>
              {isUserOnline
                ? "Online"
                : chatDetails?.groupChat
                ? `${chatDetails.members.length} members`
                : "Offline"}
            </Text>
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages || []}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        inverted
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        }
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={handleAttachmentPress}
          style={styles.attachButton}
        >
          <Ionicons name="attach" size={24} color={colors.primary[500]} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.tertiary}
          value={messageText}
          onChangeText={handleTyping}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!messageText.trim() || sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.text.primary} />
          ) : (
            <Ionicons name="send" size={20} color={colors.text.primary} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingTop: spacing.xxl,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerName: {
    ...typography.h3,
    color: colors.text.primary,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.primary[400],
  },
  messageList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  attachButton: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary[500],
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
