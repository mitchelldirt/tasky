import { grabCookieValue } from "../cookies";

describe("Cookie parsing tests", () => {
  it("should return the correct cookie value", () => {
    const cookie =
      "tz=America/New_York; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax";
    const cookieValue = grabCookieValue("tz", cookie);
    expect(cookieValue).toBe("America/New_York");
  });

  it("should return undefined if the cookie is not found", () => {
    const cookie =
      "tz=America/New_York; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax";
    const cookieValue = grabCookieValue("foo", cookie);
    expect(cookieValue).toBe(undefined);
  });
});
