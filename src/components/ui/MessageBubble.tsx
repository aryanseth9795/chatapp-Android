import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import {
  colors,
  gradients,
  borderRadius,
  typography,
  spacing,
} from "../../constants/theme";

interface Attachment {
  public_id: string;
  url: string;
}

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isMine: boolean;
  senderName?: string;
  attachments?: Attachment[];
  status?: "pending" | "sent" | "delivered" | "read";
  onAttachmentPress?: (url: string) => void;
}

export default function MessageBubble({
  content,
  timestamp,
  isMine,
  senderName,
  attachments = [],
  status = "sent",
  onAttachmentPress,
}: MessageBubbleProps) {
  const formatTime = (time: string) => {
    return moment(time).format("HH:mm");
  };

  const hasAttachments = attachments && attachments.length > 0;

  return (
    <View
      style={[
        styles.container,
        isMine ? styles.containerMine : styles.containerOther,
      ]}
    >
      {!isMine && senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}

      {isMine ? (
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bubble}
        >
          {hasAttachments && (
            <View style={styles.attachments}>
              {attachments.map((attachment, index) => (
                <TouchableOpacity
                  key={attachment.public_id || index}
                  onPress={() => onAttachmentPress?.(attachment.url)}
                  style={styles.attachment}
                >
                  <Image
                    source={{ uri: attachment.url }}
                    style={styles.attachmentImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {content && (
            <Text style={[styles.text, styles.textMine]}>{content}</Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.time, styles.timeMine]}>
              {formatTime(timestamp)}
            </Text>
            {isMine && (
              <Ionicons
                name={
                  status === "read"
                    ? "checkmark-done"
                    : status === "delivered"
                    ? "checkmark-done"
                    : "checkmark"
                }
                size={14}
                color={
                  status === "read" ? colors.accent.cyan : colors.text.primary
                }
                style={styles.statusIcon}
              />
            )}
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.bubbleOther]}>
          {hasAttachments && (
            <View style={styles.attachments}>
              {attachments.map((attachment, index) => (
                <TouchableOpacity
                  key={attachment.public_id || index}
                  onPress={() => onAttachmentPress?.(attachment.url)}
                  style={styles.attachment}
                >
                  <Image
                    source={{ uri: attachment.url }}
                    style={styles.attachmentImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {content && (
            <Text style={[styles.text, styles.textOther]}>{content}</Text>
          )}

          <Text style={[styles.time, styles.timeOther]}>
            {formatTime(timestamp)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: "80%",
  },
  containerMine: {
    alignSelf: "flex-end",
  },
  containerOther: {
    alignSelf: "flex-start",
  },
  senderName: {
    ...typography.caption,
    color: colors.primary[400],
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
    fontWeight: "600",
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleOther: {
    backgroundColor: colors.message.received,
  },
  attachments: {
    marginBottom: spacing.sm,
  },
  attachment: {
    marginBottom: spacing.xs,
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.md,
  },
  text: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  textMine: {
    color: colors.message.sentText,
  },
  textOther: {
    color: colors.message.receivedText,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  time: {
    ...typography.caption,
    fontSize: 11,
  },
  timeMine: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  timeOther: {
    color: colors.text.tertiary,
  },
  statusIcon: {
    marginLeft: spacing.xs,
  },
});
