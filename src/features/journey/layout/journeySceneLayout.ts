export type JourneyArtLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export type JourneyPoint = {
  x: number;
  y: number;
};

/** Cover-crop focus in image space. Keep the winding path, crop sky first. */
export const JOURNEY_COVER_FOCUS = {
  x: 0.5,
  y: 0.52,
} as const;

/**
 * Cover the chapter viewport without stretching. Nodes use the same box,
 * so they stay locked to the road as the crop changes by phone size.
 */
export function getJourneyArtLayout(
  viewWidth: number,
  viewHeight: number,
  artWidth: number,
  artHeight: number,
): JourneyArtLayout {
  const safeWidth = Math.max(viewWidth, 1);
  const safeHeight = Math.max(viewHeight, 1);
  const viewAspect = safeWidth / safeHeight;
  const artAspect = artWidth / artHeight;

  if (viewAspect > artAspect) {
    const width = safeWidth;
    const height = width / artAspect;
    const extra = Math.max(0, height - safeHeight);
    return {
      width,
      height,
      left: 0,
      top: -extra * JOURNEY_COVER_FOCUS.y,
    };
  }

  const height = safeHeight;
  const width = height * artAspect;
  const extra = Math.max(0, width - safeWidth);
  return {
    width,
    height,
    left: -extra * JOURNEY_COVER_FOCUS.x,
    top: 0,
  };
}

/** Viewport coordinates, including letterbox origin. */
export function mapJourneySourcePoint(
  layout: JourneyArtLayout,
  source: JourneyPoint,
): JourneyPoint {
  return {
    x: layout.left + layout.width * source.x,
    y: layout.top + layout.height * source.y,
  };
}

/** Coordinates inside the fitted art box (nodes live here). */
export function mapJourneyArtPoint(layout: JourneyArtLayout, source: JourneyPoint): JourneyPoint {
  return {
    x: layout.width * source.x,
    y: layout.height * source.y,
  };
}

export function toPercent(value: number): `${number}%` {
  return `${value * 100}%` as `${number}%`;
}
