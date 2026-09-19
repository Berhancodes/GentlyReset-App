/**
 * Shared Home landscape layout.
 *
 * Environment and mascot live in the same cover-cropped image space so the
 * character stays locked to the log when phones crop the art.
 */

/** Intrinsic size of `home-morning-environment.png`. */
export const HOME_ENVIRONMENT_ART = {
  width: 853,
  height: 1844,
} as const;

export const HOME_ENVIRONMENT_ART_ASPECT = HOME_ENVIRONMENT_ART.width / HOME_ENVIRONMENT_ART.height;

/**
 * Cover-crop focal point (0–1 in image space).
 * Horizontal: keep the mascot and cottage when side-cropping.
 * Vertical: keep sky behind the greeting; crop meadow edges first.
 */
export const HOME_COVER_FOCUS = {
  x: 0.48,
  y: 0.38,
} as const;

/** Intrinsic size of `home-mascot-body.png` — the mascot group's coordinate space. */
export const HOME_MASCOT_BODY = {
  width: 1178,
  height: 1335,
} as const;

export const HOME_MASCOT_BODY_ASPECT = HOME_MASCOT_BODY.width / HOME_MASCOT_BODY.height;

/** Intrinsic size of `home-mascot-arms-mug.png` (steam stripped from the upper canvas). */
export const HOME_MASCOT_ARMS = {
  width: 1312,
  height: 1199,
} as const;

/** Intrinsic size of `home-mascot-steam.png`. */
export const HOME_MASCOT_STEAM = {
  width: 1024,
  height: 1536,
} as const;

/**
 * Mascot group placement in illustrated-scene space (0–1 of the environment
 * image, after cover-crop). Tuned so the seated character rests on the log
 * like the original baked Home illustration.
 */
export const HOME_MASCOT_SCENE = {
  left: 0.055,
  top: 0.562,
  width: 0.32,
} as const;

/**
 * Arms + mug overlay in body-canvas pixels.
 * Scale 0.57 and origin (350, 338) were fit to the mascot-with-mug reference
 * using the flower / mug landmarks.
 */
export const HOME_MASCOT_ARMS_LAYOUT = {
  scale: 0.57,
  left: 350,
  top: 338,
} as const;

/**
 * Sip pivot in arms-layer local coordinates.
 * Near the inner left elbow / shoulder join — not the sprite center — so a
 * later rotate can lift the mug toward the mouth.
 */
export const HOME_MASCOT_ARMS_PIVOT = {
  xPercent: 0.22,
  yPercent: 0.71,
} as const;

/**
 * Steam overlay in body-canvas pixels.
 * Scale 0.20 places the wisp on the coffee surface of the aligned mug.
 */
export const HOME_MASCOT_STEAM_LAYOUT = {
  scale: 0.2,
  left: 714,
  top: 375,
} as const;

export type CoverLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export type LayoutRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function getHomeCoverLayout(viewWidth: number, viewHeight: number): CoverLayout {
  const safeHeight = Math.max(viewHeight, 1);
  const viewAspect = viewWidth / safeHeight;

  if (viewAspect > HOME_ENVIRONMENT_ART_ASPECT) {
    const width = viewWidth;
    const height = viewWidth / HOME_ENVIRONMENT_ART_ASPECT;
    const extra = Math.max(0, height - safeHeight);
    return {
      width,
      height,
      left: 0,
      top: -extra * HOME_COVER_FOCUS.y,
    };
  }

  const height = safeHeight;
  const width = safeHeight * HOME_ENVIRONMENT_ART_ASPECT;
  const extra = Math.max(0, width - viewWidth);
  return {
    width,
    height,
    left: -extra * HOME_COVER_FOCUS.x,
    top: 0,
  };
}

/** Mascot group rectangle in view pixels, using the same cover box as the environment. */
export function getHomeMascotGroupRect(cover: CoverLayout): LayoutRect {
  const width = cover.width * HOME_MASCOT_SCENE.width;
  const height = width / HOME_MASCOT_BODY_ASPECT;
  return {
    left: cover.left + cover.width * HOME_MASCOT_SCENE.left,
    top: cover.top + cover.height * HOME_MASCOT_SCENE.top,
    width,
    height,
  };
}

export function getHomeMascotArmsRect(group: LayoutRect): LayoutRect {
  const width =
    group.width *
    ((HOME_MASCOT_ARMS.width * HOME_MASCOT_ARMS_LAYOUT.scale) / HOME_MASCOT_BODY.width);
  const height = width * (HOME_MASCOT_ARMS.height / HOME_MASCOT_ARMS.width);
  return {
    left: group.width * (HOME_MASCOT_ARMS_LAYOUT.left / HOME_MASCOT_BODY.width),
    top: group.height * (HOME_MASCOT_ARMS_LAYOUT.top / HOME_MASCOT_BODY.height),
    width,
    height,
  };
}

export function getHomeMascotSteamRect(group: LayoutRect): LayoutRect {
  const width =
    group.width *
    ((HOME_MASCOT_STEAM.width * HOME_MASCOT_STEAM_LAYOUT.scale) / HOME_MASCOT_BODY.width);
  const height = width * (HOME_MASCOT_STEAM.height / HOME_MASCOT_STEAM.width);
  return {
    left: group.width * (HOME_MASCOT_STEAM_LAYOUT.left / HOME_MASCOT_BODY.width),
    top: group.height * (HOME_MASCOT_STEAM_LAYOUT.top / HOME_MASCOT_BODY.height),
    width,
    height,
  };
}

export function toPercent(value: number): `${number}%` {
  // Template interpolations are `string`; RN DimensionValue wants `${number}%`.
  return `${value * 100}%` as `${number}%`;
}
