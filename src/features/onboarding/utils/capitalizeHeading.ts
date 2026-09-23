/** Capitalize the first letter of a story heading. Leaves the rest of the line as written. */
export function capitalizeHeading(text: string): string {
  const letterIndex = text.search(/[A-Za-z]/);
  if (letterIndex < 0) {
    return text;
  }

  const letter = text[letterIndex];
  if (!letter) {
    return text;
  }

  return `${text.slice(0, letterIndex)}${letter.toUpperCase()}${text.slice(letterIndex + 1)}`;
}
