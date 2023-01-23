import { differenceInCalendarDays, differenceInCalendarYears, format, isBefore, parseISO } from "date-fns";

type time = {
  date: string,
  time: string,
  isOverdue: boolean
}

export default function parseDueDate(dueDate: string): time {

  const dueDateDate = parseISO(dueDate.slice(0, dueDate.indexOf('.')))
  const diffInDays = Math.abs(differenceInCalendarDays(new Date(), dueDateDate));
  const diffInYears = differenceInCalendarYears(new Date(), dueDateDate);
  const isSameYear = diffInYears === 0;
  const isDueBeforeToday = isBefore(dueDateDate, new Date());
  const time = format(dueDateDate, 'p');

  if (isDueBeforeToday === false && diffInDays === 0) {
    return {
      date: 'Today',
      time: time,
      isOverdue: false
    }
  } else if (isDueBeforeToday === false && diffInDays === 1) {
    return {
      date: 'Tomorrow',
      time: time,
      isOverdue: false
    }
  } else if (isDueBeforeToday === true && diffInDays === 1) {
    return {
      date: 'Yesterday',
      time: time,
      isOverdue: true
    }
  } else if (isDueBeforeToday === false && diffInDays < 8) {
    return {
      date: format(dueDateDate, 'EEEE'),
      time: time,
      isOverdue: false
    }
  } else if (isDueBeforeToday === false && isSameYear === false) {
    return {
      date: format(dueDateDate, 'PPP'),
      time: time,
      isOverdue: false
    }
  } else if (isDueBeforeToday === true && isSameYear === false) {
    return {
      date: format(dueDateDate, 'PPP'),
      time: time,
      isOverdue: true
    }
  } else if (isSameYear === true && isDueBeforeToday === true) {
    return {
      date: format(dueDateDate, 'LLLL d'),
      time: time,
      isOverdue: true
    }
  } else if (isSameYear === true && (isDueBeforeToday === false && diffInDays > 7)) {
    return {
      date: format(dueDateDate, 'LLLL d'),
      time: time,
      isOverdue: false
    }
  }

  return {
    date: 'null',
    time: 'null',
    isOverdue: true
  }
}