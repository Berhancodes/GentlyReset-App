export type JourneySeason = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Calendar season for the Journey scene, Northern Hemisphere meteorological
 * seasons: Mar–May spring, Jun–Aug summer, Sep–Nov autumn, Dec–Feb winter.
 */
export function getJourneySeason(date: Date): JourneySeason {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) {
    return 'spring';
  }
  if (month >= 5 && month <= 7) {
    return 'summer';
  }
  if (month >= 8 && month <= 10) {
    return 'autumn';
  }
  return 'winter';
}
