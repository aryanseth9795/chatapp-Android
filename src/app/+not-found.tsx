import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { colors, typography, spacing } from "../constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>This screen doesn't exist.</Text>
        <Link href="/(main)/(home)" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: 72,
    fontWeight: "700",
    color: colors.primary[500],
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.h3,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  linkText: {
    ...typography.body,
    color: colors.primary[400],
    fontWeight: "600",
  },
});
