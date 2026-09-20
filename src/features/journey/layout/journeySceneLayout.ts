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

/**
 * Fit the full illustration into the chapter viewport without stretching.
 * Wider viewports letterbox on the sides so the whole path stays visible.
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
    const height = safeHeight;
    const width = height * artAspect;
    return {
      width,
      height,
      left: (safeWidth - width) / 2,
      top: 0,
    };
  }

  const width = safeWidth;
  const height = width / artAspect;
  return {
    width,
    height,
    left: 0,
    top: (safeHeight - height) / 2,
  };
}

export function mapJourneySourcePoint(
  layout: JourneyArtLayout,
  source: JourneyPoint,
): JourneyPoint {
  return {
    x: layout.left + layout.width * source.x,
    y: layout.top + layout.height * source.y,
  };
}

export function toPercent(value: number): `${number}%` {
  return `${value * 100}%` as `${number}%`;
}
