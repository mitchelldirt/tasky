import {
  differenceInCalendarDays,
  differenceInCalendarYears,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

type time = {
  date: string;
  time: string;
  isOverdue: boolean;
};

export function parseDueDate(
  dueDate: string,
  accountForTime: boolean
): time {
  const dueDateDate = parseISO(dueDate.slice(0, dueDate.indexOf(".")));
  const diffInDays = Math.abs(
    differenceInCalendarDays(new Date(), dueDateDate)
  );
  const diffInYears = differenceInCalendarYears(new Date(), dueDateDate);
  const isSameYear = diffInYears === 0;
  const isOverdue = isBeforeNow(dueDateDate, accountForTime);
  const time = format(dueDateDate, "p");

  if (isOverdue === false && diffInDays === 0) {
    return {
      date: "Today",
      time: time,
      isOverdue: false,
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

  return isBefore(startOfDay(dueDate), startOfDay(new Date()));
}

export function extractDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function extractTime(date: string) {
  return date.slice(date.indexOf("T") + 1, date.indexOf("."));
}