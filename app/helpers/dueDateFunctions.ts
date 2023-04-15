import {
  differenceInCalendarDays,
  differenceInCalendarYears,
  isBefore,
  parseISO,
  startOfDay,
  format,
  addHours,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

type time = {
  date: string;
  time: string;
  isOverdue: boolean;
};

export function parseDueDate(
  dueDate: string,
  accountForTime: boolean,
  completed: boolean,
  tz: string
): time {
  // * new Date() returns the current date and time in the local time zone
  const dueDateDate = utcToZonedTime(dueDate, tz);

  const diffInDays = Math.abs(
    differenceInCalendarDays(new Date(), dueDateDate)
  );
  const diffInYears = differenceInCalendarYears(new Date(), dueDateDate);
  const isSameYear = diffInYears === 0;

  const isOverdue = isBeforeNow(dueDateDate, accountForTime);
  const time = format(utcToZonedTime(dueDateDate, tz), "p");

  if (completed === true) {
    return {
      date: format(dueDateDate, "LLLL d"),
      time: time,
      isOverdue: false,
    };
  } else if (isOverdue === false && diffInDays === 0) {
    return {
      date: "Today",
      time: time,
      isOverdue: false,
    };
  } else if (isOverdue === true && diffInDays === 0) {
    return {
      date: "Today",
      time: time,
      isOverdue: true,
    };
  } else if (isOverdue === false && diffInDays === 1) {
    return {
      date: "Tomorrow",
      time: time,
      isOverdue: false,
    };
  } else if (isOverdue === true && diffInDays === 1) {
    return {
      date: "Yesterday",
      time: time,
      isOverdue: true,
    };
  } else if (isOverdue === false && diffInDays < 8) {
    return {
      date: format(dueDateDate, "EEEE"),
      time: time,
      isOverdue: false,
    };
  } else if (isOverdue === false && isSameYear === false) {
    return {
      date: format(dueDateDate, "PPP"),
      time: time,
      isOverdue: false,
    };
  } else if (isOverdue === true && isSameYear === false) {
    return {
      date: format(dueDateDate, "PPP"),
      time: time,
      isOverdue: true,
    };
  } else if (isSameYear === true && isOverdue === true) {
    return {
      date: format(dueDateDate, "LLLL d"),
      time: time,
      isOverdue: true,
    };
  } else if (isSameYear === true && isOverdue === false && diffInDays > 7) {
    return {
      date: format(dueDateDate, "LLLL d"),
      time: time,
      isOverdue: false,
    };
  }

  return {
    date: "null",
    time: "null",
    isOverdue: true,
  };
}

function isBeforeNow(dueDate: Date, accountForTime: boolean): boolean {
  if (accountForTime) return isBefore(dueDate, new Date());

  if (dueDate == new Date()) return false;
  let taskDueDate = startOfDay(dueDate);
  let today = startOfDay(new Date());
  let isOverdue = isBefore(taskDueDate, today);

  return isOverdue;
}

export function extractDate(UTCdate: string) {
  return format(new Date(UTCdate), "yyyy-MM-dd");
}

export function extractTime(date: string) {
  return format(new Date(date), "HH:mm:ss");
}

export function formatUserDate(dueDate: string | null, dueTime: string) {
  if (dueDate === null) return null;

  const hoursOffset = new Date().getTimezoneOffset() / 60;
  let date = addHours(
    parseISO(dueDate + "T" + dueTime + ":00.000Z"),
    hoursOffset
  );

  return date;
}
