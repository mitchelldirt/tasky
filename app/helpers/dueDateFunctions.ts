import {
  differenceInCalendarDays,
  differenceInCalendarYears,
  isBefore,
  parseISO,
  startOfDay,
  format
} from "date-fns";

type time = {
  date: string;
  time: string;
  isOverdue: boolean;
};

export function parseDueDate(
  dueDate: string,
  accountForTime: boolean,
  completed: boolean
): time {

  const dueDateDate = parseISO(dueDate.slice(0, dueDate.indexOf(".")));
  const diffInDays = Math.abs(
    differenceInCalendarDays(new Date(), dueDateDate)
  );
  const diffInYears = differenceInCalendarYears(new Date(), dueDateDate);
  const isSameYear = diffInYears === 0;
  const isOverdue = isBeforeNow(dueDateDate, accountForTime);
  // ! I had to change from using the `dueDate` variable to using the `dueDateDate` variable. This is because the ISO string formatting was off using `dueDate`, but it worked fine using the Date object in `dueDateDate`.

  // TODO: fix the time being off below by four hours lol. Might need to use the tz package instead of date-fns for this.
  console.log("dueDateDate", dueDate);
  const time = format(new Date(dueDate.slice(0, dueDate.indexOf('.'))), "p");
  console.log("time", time)
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
    }
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