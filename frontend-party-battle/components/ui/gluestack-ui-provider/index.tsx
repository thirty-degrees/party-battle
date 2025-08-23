import React, { useEffect } from 'react';
import { config } from './config';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/Colors';

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  mode = 'system',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const scheme = mode === 'system' ? colorScheme ?? 'light' : mode;

  useEffect(() => {
    if (mode !== 'system') {
      setColorScheme(mode);
    }
  }, [mode, setColorScheme]);

  return (
    <View
      style={[
        config[scheme!],
        {
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: Colors[scheme!].background,
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
