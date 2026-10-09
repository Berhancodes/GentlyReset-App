import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { VideoView } from 'expo-video';

import { MASCOT_ANIMATIONS, type MascotState } from '@/components/mascot/mascotAnimations';
import { MASCOT_IDLE_STILL } from '@/components/mascot/mascotAssets';
import { getMascotClipTransform } from '@/components/mascot/mascotLayout';
import { useMascotAnimation, type MascotHandle } from '@/components/mascot/useMascotAnimation';

type MascotProps = {
  width: number;
  height: number;
  onReadyChange?: (ready: boolean) => void;
  onStateChange?: (state: MascotState) => void;
};

export const Mascot = forwardRef<MascotHandle, MascotProps>(function Mascot(
  { width, height, onReadyChange, onStateChange },
  ref,
) {
  const { ready, state, visibleAnimation, players, play, playRandom } = useMascotAnimation();

  useImperativeHandle(ref, () => ({ play, playRandom }), [play, playRandom]);

  useEffect(() => {
    onReadyChange?.(ready);
  }, [onReadyChange, ready]);

  useEffect(() => {
    onStateChange?.(state);
  }, [onStateChange, state]);

  return (
    <View style={[styles.stage, { width, height }]}>
      {MASCOT_ANIMATIONS.map((animation) => (
        // The alignment transform lives on a plain View: `VideoView` on web hands its
        // style straight to <video>, which drops React Native transform arrays, so
        // reaction clips would play unaligned (smaller and higher than idle).
        <View
          key={animation}
          pointerEvents="none"
          style={[
            styles.clip,
            {
              width,
              height,
              opacity: visibleAnimation === animation ? 1 : 0,
              zIndex: visibleAnimation === animation ? 1 : 0,
              ...getMascotClipTransform(animation, width, height),
            },
          ]}
        >
          <VideoView
            player={players[animation]}
            nativeControls={false}
            allowsVideoFrameAnalysis={false}
            contentFit="contain"
            surfaceType={Platform.OS === 'android' ? 'textureView' : undefined}
            style={[styles.video, { width, height }]}
            pointerEvents="none"
          />
        </View>
      ))}
      {!ready ? (
        <Image
          source={MASCOT_IDLE_STILL}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={[styles.clip, { width, height }]}
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  stage: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  clip: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  video: {
    backgroundColor: 'transparent',
  },
});
