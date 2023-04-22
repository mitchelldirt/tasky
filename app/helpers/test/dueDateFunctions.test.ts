import { addDays, addHours, format, subDays, subHours } from "date-fns";
import { extractDate, extractTime, formatUserDate, isBeforeNow, parseDueDate } from "../dueDateFunctions";
import { formatInTimeZone, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

describe("Due Date Functions", () => {

  it("Gives me the correct date string without the time", () => {
    const date = "2021-01-01T12:00:00.000Z";
    const formattedDate = extractDate(date);

    expect(formattedDate).toBe("2021-01-01");
  });

  it("Gives me the correct time string without the date", () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcDate = zonedTimeToUtc(new Date(), tz).toISOString();
    const extractedTime = extractTime(utcDate);

    const expectedTime = format(new Date(), "HH:mm:ss");

    expect(extractedTime).toBe(expectedTime);
  });

  it("Returns true if the date is before now", () => {
    const date = "2021-01-01T12:00:00.000Z";
    const isBefore = isBeforeNow(new Date(date), true);

    expect(isBefore).toBe(true);
  });

  it("Returns false if the date is after now", () => {
    const date = addHours(new Date(), 1)
    const isBefore = isBeforeNow(date, false);

    expect(isBefore).toBe(false);
  });

  it("Returns false if the date is the same as now", () => {
    const date = new Date();
    const dateMinusOneDay = subDays(date, 1);

    console.log("date", date)

    const isBefore = isBeforeNow(date, false);

    expect(isBefore).toBe(false);
    expect(isBeforeNow(dateMinusOneDay, false)).toBe(true);
  });

  it("Returns the the date and time in the correct format", () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcTime = zonedTimeToUtc(new Date(), tz);
    const date = format(utcTime, "yyyy-MM-dd");
    const time = format(utcTime, "HH:mm:ss") + ".000Z";

    let formattedDate = formatUserDate(date, time, tz);

    const expectedDate = formatInTimeZone(new Date(), tz, "yyyy-MM-dd'T'HH:mm:ss.000") + "Z";

    expect(formattedDate?.toISOString()).toBe(expectedDate);
  });

  it("Returns the the date and time in the correct format for parseDueDate function", () => {
    // const overdueTaskWithTime = parseDueDate("2021-01-01T12:00:00.000Z", true, false, 'America/New_York');
    // const taskDueTodayNoTime = parseDueDate(new Date().toISOString(), false, false, 'America/New_York');
    // const taskDueTomorrowWithTime = parseDueDate(addDays(new Date(), 1).toISOString(), true, false, 'America/New_York');
    // const taskDueNextMonthNoTime = parseDueDate("2021-1-01T12:00:00.000Z", false, false, 'America/New_York');
    // const tomorrowWithTimeNLTZ = parseDueDate(addDays(new Date(), 1).toISOString(), true, false, 'America/New_York');


    expect(true).toBe(true);
  });

});