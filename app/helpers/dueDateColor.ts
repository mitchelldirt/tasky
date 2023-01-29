export default function dueDateColor(date: string, isOverdue: boolean): string {
  if (isOverdue) return "text-red-400";

  if (date === "Today") return "text-green-400";

  if (date === "Tomorrow") return "text-yellow-400";

  return "text-gray-400";
}
