import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

type ExpoWidgetsNative = {
  widgetsDirectory?: string | null;
};

/**
 * The widget native module only exists in a real iOS build with the widget extension.
 * Expo Go, web and Android don't have it, so everything widget-related checks this first
 * and loads `expo-widgets` lazily; importing it without the module crashes the app.
 */
const nativeWidgets =
  Platform.OS === 'ios' ? requireOptionalNativeModule<ExpoWidgetsNative>('ExpoWidgets') : null;

export const widgetsAvailable = nativeWidgets !== null;

/** The folder shared by the app and the widget, as a file URL. */
export function getWidgetsDirectory(): string | null {
  return nativeWidgets?.widgetsDirectory ?? null;
}
