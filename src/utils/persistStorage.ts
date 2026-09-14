import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Expo-compatible storage for Zustand persist (native + web). */
export const asyncPersistStorage = createJSONStorage(() => AsyncStorage);
