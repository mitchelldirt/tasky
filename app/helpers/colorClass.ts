export function createTailwindTextColor(color: string) {
  if (color === "white") {
    return "text-white";
  }

  return `text-${color}-400`;
}
