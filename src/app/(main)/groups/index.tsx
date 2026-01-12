import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EmptyState from "../../../components/ui/EmptyState";
import { colors, spacing, typography } from "../../../constants/theme";

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Groups</Text>
      </View>

      <EmptyState
        icon="people-outline"
        title="Groups Feature"
        description="Group chat functionality coming soon"
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
});
