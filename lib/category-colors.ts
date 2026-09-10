export function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

export function getCategoryColor(category: string) {
  const normalizedCategory = normalizeCategory(category);

  let hash = 0;

  for (let i = 0; i < normalizedCategory.length; i++) {
    hash =
      normalizedCategory.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 70%, 55%)`;
}