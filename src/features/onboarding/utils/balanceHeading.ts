/**
 * Break a centred heading into even lines, like CSS `text-wrap: balance`,
 * so a question never ends on one lonely word.
 *
 * `charactersPerLine` is roughly how many characters fit across the column.
 */
export function balanceHeading(text: string, charactersPerLine: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  const lineCount = Math.ceil(text.length / Math.max(1, charactersPerLine));
  if (lineCount < 2 || words.length < 2) {
    return text;
  }

  const target = text.length / lineCount;
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    const linesLeft = lineCount - lines.length;
    // Start a new line once this one is closer to the target without the word than with it.
    if (
      current &&
      linesLeft > 1 &&
      Math.abs(next.length - target) > Math.abs(current.length - target)
    ) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  lines.push(current);
  return lines.join('\n');
}
