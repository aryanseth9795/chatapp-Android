import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { colors, gradients } from "../../constants/theme";
import { useEffect } from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "gradient";
}

export default function LoadingSpinner({
  size = "medium",
  variant = "gradient",
}: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const sizeMap = {
    small: 24,
    medium: 48,
    large: 72,
  };

  const spinnerSize = sizeMap[size];

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);

    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  if (variant === "primary") {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size={size === "small" ? "small" : "large"}
          color={colors.primary[500]}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientSpinner,
            {
              width: spinnerSize,
              height: spinnerSize,
              borderRadius: spinnerSize / 2,
            },
          ]}
        >
          <View
            style={[
              styles.innerCircle,
              {
                width: spinnerSize - 8,
                height: spinnerSize - 8,
                borderRadius: (spinnerSize - 8) / 2,
              },
            ]}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientSpinner: {
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    backgroundColor: colors.background.primary,
  },
});
