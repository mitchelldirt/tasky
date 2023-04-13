export function grabCookieValue(cookieName: string, cookie: string) {
  const cookieValue = cookie
    .split("; ")
    .find((row) => row.startsWith(cookieName))
    ?.split("=")[1];
  return cookieValue;
}