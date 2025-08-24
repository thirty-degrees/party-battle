import { Heading } from "@/components/ui/heading";
import React from "react";
import { View } from "react-native";

// Static rainbow colors (optimized for dark backgrounds)
const rainbowColors = [
  "#FF6B6B", // Bright Red
  "#FFA500", // Orange
  "#FFD93D", // Bright Yellow
  "#6BCF7F", // Bright Green
  "#4ECDC4", // Bright Cyan
];

// Simple rainbow text component
export default function RainbowText({ text }: { text: string }) {
  return (
    <View className="flex-row">
      {text.split("").map((letter, index) => (
        <Heading
          key={index}
          size="xl"
          style={{ color: rainbowColors[index % rainbowColors.length] }}
        >
          {letter}
        </Heading>
      ))}
    </View>
  );
}
