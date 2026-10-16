/**
 * One concrete day of a focus area. `{m}` is replaced with the day's minutes.
 * `prep` and `act` are short checklist labels; `detail` is the full sentence.
 */
export type AreaMove = {
  prep: string;
  act: string;
  detail: string;
};

export function move(prep: string, act: string, detail: string): AreaMove {
  return { prep, act, detail };
}
