/**
 * IANA timezone from the device, e.g. America/Edmonton.
 * Returns null for missing values or numeric UTC offsets.
 */
export function getDeviceIanaTimezone(): string | null {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (typeof timezone !== 'string') {
      return null;
    }

    const trimmed = timezone.trim();
    if (trimmed.length === 0) {
      return null;
    }

    if (/^[+-]?\d/.test(trimmed) || /^gmt[+-]/i.test(trimmed) || trimmed.includes(' ')) {
      return null;
    }

    return trimmed;
  } catch {
    return null;
  }
}
