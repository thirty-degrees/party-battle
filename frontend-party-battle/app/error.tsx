import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function ErrorScreen() {
  useLocalSearchParams<{ error: string }>();

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-black dark:bg-white justify-center items-center p-4">
      <View className="items-center max-w-sm">
        <Text className="text-6xl mb-6">🏠</Text>

        <Heading
          size="xl"
          className="text-2xl font-bold text-white dark:text-black mb-4 text-center"
        >
          Oops! Something went wrong
        </Heading>

        <Text className="text-gray-300 dark:text-gray-700 text-center mb-8 leading-6">
          Hey! The room you&apos;re looking for doesn&apos;t exist or is full. Go
          back home and create a new one! 🎮
        </Text>

        <Button
          size="lg"
          action="primary"
          onPress={handleGoHome}
          className="px-8 py-4"
        >
          <ButtonText>Go Home & Try Again</ButtonText>
        </Button>
      </View>
    </View>
  );
}
