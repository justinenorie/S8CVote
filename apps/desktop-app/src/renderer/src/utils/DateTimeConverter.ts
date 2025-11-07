// Year month day converter
export function toYMDLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Time converter
export function toHMLocal(t: Date | string) {
  if (typeof t === "string") return t; // assume already "HH:mm"
  const h = String(t.getHours()).padStart(2, "0");
  const m = String(t.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function nowYMD() {
  return toYMDLocal(new Date());
}
export function nowHM() {
  return toHMLocal(new Date());
}
