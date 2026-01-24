export const formatChatTime = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  try {
    if (sameDay) {
      return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return sameDay
      ? `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`
      : `${d.getMonth() + 1}/${d.getDate()}`;
  }
};
