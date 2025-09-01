import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 p-4 justify-center items-center bg-background-0 dark:bg-background-950">
      <View className="max-w-md w-full justify-center gap-40 items-center ">
        <Heading>This screen does not exist.</Heading>
        <Link href="/">
          <Text>→ go to home screen</Text>
        </Link>
      </View>
    </View>
  );
}
