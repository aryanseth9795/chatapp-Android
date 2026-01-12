import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors, borderRadius } from "../../constants/theme";

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  online?: boolean;
  showOnlineIndicator?: boolean;
}

export default function Avatar({
  uri,
  name,
  size = 48,
  online = false,
  showOnlineIndicator = false,
}: AvatarProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const avatarSize = { width: size, height: size, borderRadius: size / 2 };
  const initialsSize = size * 0.4;

  return (
    <View style={[styles.container, avatarSize]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, avatarSize]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, avatarSize]}>
          <Text style={[styles.initials, { fontSize: initialsSize }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {showOnlineIndicator && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              bottom: size * 0.05,
              right: size * 0.05,
            },
            online ? styles.online : styles.offline,
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    backgroundColor: colors.background.card,
  },
  placeholder: {
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: colors.text.primary,
    fontWeight: "700",
  },
  onlineIndicator: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  online: {
    backgroundColor: colors.status.online,
  },
  offline: {
    backgroundColor: colors.status.offline,
  },
});
