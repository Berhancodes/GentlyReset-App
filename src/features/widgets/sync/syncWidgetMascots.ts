import { Asset } from 'expo-asset';
import { Directory, File } from 'expo-file-system';

import { getWidgetsDirectory } from '@/features/widgets/native/widgetsAvailability';
import type { WidgetMascots } from '@/features/widgets/utils/getWidgetTimeline';

/** Still poses the widget can show; widgets can't play the mascot's videos. */
const MASCOT_SOURCES = {
  idle: {
    module: require('../../../../assets/images/mascot/stage/idle-listen.png'),
    name: 'mascot-idle.png',
  },
  happy: {
    module: require('../../../../assets/images/mascot/stage/react-warm.png'),
    name: 'mascot-happy.png',
  },
  cheer: {
    module: require('../../../../assets/images/mascot/stage/cheer.png'),
    name: 'mascot-cheer.png',
  },
} as const;

/**
 * Copies the mascot pictures into the folder the app and widget share (once), and returns
 * their file URLs. Returns null where widgets aren't available (web, Android, no App Group).
 */
export async function syncWidgetMascots(): Promise<WidgetMascots | null> {
  const widgetsDirectory = getWidgetsDirectory();
  if (!widgetsDirectory) {
    return null;
  }
  const directory = new Directory(widgetsDirectory);
  const entries = await Promise.all(
    (Object.keys(MASCOT_SOURCES) as (keyof typeof MASCOT_SOURCES)[]).map(async (key) => {
      const source = MASCOT_SOURCES[key];
      const target = new File(directory, source.name);
      if (!target.exists) {
        const asset = await Asset.fromModule(source.module).downloadAsync();
        if (!asset.localUri) {
          throw new Error(`Could not load ${source.name}`);
        }
        new File(asset.localUri).copy(target);
      }
      return [key, target.uri] as const;
    }),
  );
  return Object.fromEntries(entries) as WidgetMascots;
}
