import React, { useEffect } from 'react';
import { config } from './config';
import { View, ViewProps, useColorScheme as useRNColorScheme } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/Colors';

export function GluestackUIProvider({
  ...props
}: {
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme } = useColorScheme();

  return (
    <View
      style={[
        config[colorScheme!],
        {
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: Colors[colorScheme!].background,
        },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
