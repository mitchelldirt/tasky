export function calculateTextSize(text: string) {

  if (text.length > 20) {
    return "text-sm sm:text-base"
  }

  if (text.length > 10) {
    return "text-xs sm:text-xl"
  }



  return "text-lg sm:text-2xl";
}