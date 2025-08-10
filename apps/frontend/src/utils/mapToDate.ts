export const mapToDate = <T>(value: T): Date | null => {
  if (value instanceof Date) return value;
  if (!value) return null;

  if (typeof value === "string") {
    const dateString = value.trim();

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateString)) {
      return new Date(dateString + "Z");
    }

    return new Date(dateString);
  }

  return new Date(value as any);
};
