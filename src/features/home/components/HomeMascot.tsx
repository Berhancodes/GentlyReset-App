import { Image, StyleSheet, View } from 'react-native';

import {
  HOME_MASCOT_ARMS,
  HOME_MASCOT_ARMS_LAYOUT,
  HOME_MASCOT_ARMS_PIVOT,
  HOME_MASCOT_BODY,
  HOME_MASCOT_BODY_ASPECT,
  HOME_MASCOT_SCENE,
  HOME_MASCOT_STEAM,
  HOME_MASCOT_STEAM_LAYOUT,
  toPercent,
} from '@/features/home/layout/homeSceneLayout';

const MASCOT_BODY = require('../../../../assets/images/app/home-mascot-body.png');
const MASCOT_ARMS_MUG = require('../../../../assets/images/app/home-mascot-arms-mug.png');
const MASCOT_STEAM = require('../../../../assets/images/app/home-mascot-steam.png');

const ARMS_WIDTH_PERCENT =
  (HOME_MASCOT_ARMS.width * HOME_MASCOT_ARMS_LAYOUT.scale) / HOME_MASCOT_BODY.width;
const ARMS_LEFT_PERCENT = HOME_MASCOT_ARMS_LAYOUT.left / HOME_MASCOT_BODY.width;
const ARMS_TOP_PERCENT = HOME_MASCOT_ARMS_LAYOUT.top / HOME_MASCOT_BODY.height;

const STEAM_WIDTH_PERCENT =
  (HOME_MASCOT_STEAM.width * HOME_MASCOT_STEAM_LAYOUT.scale) / HOME_MASCOT_BODY.width;
const STEAM_LEFT_PERCENT = HOME_MASCOT_STEAM_LAYOUT.left / HOME_MASCOT_BODY.width;
const STEAM_TOP_PERCENT = HOME_MASCOT_STEAM_LAYOUT.top / HOME_MASCOT_BODY.height;

/**
 * Layered seated mascot. All layers share one parent (body canvas) so a later
 * sip animation can rotate arms/mug without breaking alignment.
 * Decorative — does not compete with Home UI for accessibility focus.
 */
export function HomeMascot() {
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.group}
    >
      <Image
        source={MASCOT_BODY}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.body}
      />
      <View style={styles.arms}>
        <Image
          source={MASCOT_ARMS_MUG}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.layerImage}
        />
      </View>
      <Image
        source={MASCOT_STEAM}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={styles.steam}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    position: 'absolute',
    left: toPercent(HOME_MASCOT_SCENE.left),
    top: toPercent(HOME_MASCOT_SCENE.top),
    width: toPercent(HOME_MASCOT_SCENE.width),
    aspectRatio: HOME_MASCOT_BODY_ASPECT,
    pointerEvents: 'none',
  },
  body: {
    width: '100%',
    height: '100%',
  },
  arms: {
    position: 'absolute',
    left: toPercent(ARMS_LEFT_PERCENT),
    top: toPercent(ARMS_TOP_PERCENT),
    width: toPercent(ARMS_WIDTH_PERCENT),
    aspectRatio: HOME_MASCOT_ARMS.width / HOME_MASCOT_ARMS.height,
    transformOrigin: `${HOME_MASCOT_ARMS_PIVOT.xPercent * 100}% ${HOME_MASCOT_ARMS_PIVOT.yPercent * 100}%`,
    transform: [{ rotate: '0deg' }],
  },
  steam: {
    position: 'absolute',
    left: toPercent(STEAM_LEFT_PERCENT),
    top: toPercent(STEAM_TOP_PERCENT),
    width: toPercent(STEAM_WIDTH_PERCENT),
    aspectRatio: HOME_MASCOT_STEAM.width / HOME_MASCOT_STEAM.height,
  },
  layerImage: {
    width: '100%',
    height: '100%',
  },
});
