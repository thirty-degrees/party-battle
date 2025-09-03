import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const driver =
  Platform.OS === 'web'
    ? {
        getItem: async (k: string) => localStorage.getItem(k),
        setItem: async (k: string, v: string) => localStorage.setItem(k, v),
        removeItem: async (k: string) => localStorage.removeItem(k),
      }
    : {
        getItem: (k: string) => AsyncStorage.getItem(k),
        setItem: (k: string, v: string) => AsyncStorage.setItem(k, v),
        removeItem: (k: string) => AsyncStorage.removeItem(k),
      };

export const storage = {
  getItem: driver.getItem,
  setItem: driver.setItem,
  removeItem: driver.removeItem,
};
