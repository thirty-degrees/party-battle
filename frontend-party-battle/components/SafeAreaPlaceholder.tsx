import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaPlaceholderProps {
  position: "top" | "bottom";
  className?: string;
}

export default function SafeAreaPlaceholder({ position, className }: SafeAreaPlaceholderProps) {
  const insets = useSafeAreaInsets();

  const height = position === "top" ? insets.top : insets.bottom;

  return <View style={{ height }} className={className} />;
}
