/** Below this, the first sentence is too thin to stand alone and the next one joins it. */
const MIN_SUMMARY_LENGTH = 40;

/**
 * Pop-up summary of a task description: the first sentence, plus the second
 * when the first is very short. The full text stays in the plan data.
 */
export function shortenSheetDescription(description: string): string {
  const sentences = description.trim().match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length === 0) {
    return description.trim();
  }
  const first = sentences[0]?.trim() ?? '';
  const second = sentences[1]?.trim();
  if (first.length < MIN_SUMMARY_LENGTH && second) {
    return `${first} ${second}`;
  }
  return first;
}
