export function toggleMultiSelection(
  selectedIds: readonly string[],
  optionId: string,
  maxSelections?: number,
): readonly string[] {
  if (selectedIds.includes(optionId)) {
    return selectedIds.filter((id) => id !== optionId);
  }

  if (maxSelections !== undefined && selectedIds.length >= maxSelections) {
    return selectedIds;
  }

  return [...selectedIds, optionId];
}
