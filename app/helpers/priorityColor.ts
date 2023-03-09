export default function priorityColor(priority: number) {
  switch (priority) {
    case 1:
      return "text-red-400";

    case 2:
      return "text-orange-400";

    case 3:
      return "text-blue-400";

    case 4:
      return "text-gray-400";

    default:
      return "text-gray-400;";
  }
}
