export function getInitials(authorId: string) {
  if (!authorId) return "";
  const words = authorId.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0][0]?.toUpperCase() || "";
  }
  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];
  return `${firstInitial}${lastInitial}`.toUpperCase();
}
