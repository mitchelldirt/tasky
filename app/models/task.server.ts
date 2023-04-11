import type { User, Project, Task } from "@prisma/client";
import { addHours, differenceInCalendarDays, differenceInDays, formatISO, subHours, startOfDay, endOfDay, isBefore, subDays, addDays, format } from "date-fns";
import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getAllTasks({ userId }: { userId: User["id"] }) {
  return prisma.task.findMany({
    where: { userId, completed: false },
    include: {
      project: true,
    },
    orderBy: { dueDate: "asc" },
  });
}

export function getAllCompletedTasks({ userId }: { userId: User["id"] }) {
  return prisma.task.findMany({
    orderBy: { completedAt: "desc" },
    where: {
      user: {
        id: userId
      }, completed: true
    },
    include: {
      project: true,
    },
  });
}

// todo: get the users time and use that instead of new Date()
// ! todo: Make sure that the other date functions are considering the tzOffset of both the user and the server 
export function getTodayTasks({ userId }: { userId: User["id"] }, userDate: Date) {
  const userOffsetHours = Number(userDate.getTimezoneOffset()) / 60;
  const serverOffsetHours = Number(new Date().getTimezoneOffset()) / 60;
  // I need to check if the user is ahead or behind the server before I can add or subtract hours

  const isUserDateBeforeServerDate = isBefore(userDate, new Date());
  let UTCDate = new Date();
  if (serverOffsetHours !== userOffsetHours) {
    UTCDate = addHours(userDate, userOffsetHours);
  }

  const userServerDifference = differenceInCalendarDays(userDate, new Date());

  const [startTime, endTime] = getStartAndEndOfDayAdjustedForUTC(UTCDate, userOffsetHours, userServerDifference, isUserDateBeforeServerDate);

  console.log("userDate", userDate)
  console.log("userOffsetHours", userOffsetHours)
  console.log("UTCDate", UTCDate)
  console.log("isUserDateBeforeServerDate", isUserDateBeforeServerDate)
  console.log("userServerDifference", userServerDifference)
  console.log("startTime", startTime)
  console.log("endTime", endTime)

  return prisma.task.findMany({
    where: {
      userId,
      completed: false,
      dueDate: {
        gte: startTime,
        lte: endTime
      },
    },
    include: {
      project: true,
    },
    orderBy: { dueDate: "asc" },
  });
}

export function getTaskById({ id }: { id: Task["id"] }) {
  return prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      projectId: true,
      dueDate: true,
      time: true,
    },
  });
}

export function getProjects({ userId }: { userId: User["id"] }) {
  return prisma.project.findMany({
    where: { userId },
    select: { id: true, name: true, color: true },
    orderBy: { name: "desc" },
  });
}

export function getProjectTasks({
  id,
  userId,
}: Pick<Project, "id"> & { userId: User["id"] }) {
  return prisma.project.findMany({
    where: { id, userId },
    select: {
      name: true, tasks: {
        where: { completed: false },
        include: { project: true },
        orderBy: { dueDate: "desc" },
      }
    },
  });
}

export function createTask(
  { userId }: { userId: User["id"] },
  { projectId }: { projectId: Project["id"] },
  title: string,
  description: string,
  priority: number,
  dueDate: Date | null,
  time: boolean,
  userOffsetMinutes: number
) {
  let due = null;
  let userOffsetHours = userOffsetMinutes / 60;

  if (dueDate) {
    due = format(addHours(dueDate, userOffsetHours), "yyyy-MM-dd'T'HH:mm:ss.SSS") + "Z";
  }

  return prisma.task.create({
    data: {
      userId: userId,
      title: title,
      description: description,
      priority: priority,
      projectId: projectId,
      dueDate: due,
      time: time,
    },
  });
}

export function updateTask(
  { id }: { id: Task["id"] },
  title: string,
  description: string,
  priority: number,
  dueDate: Date | null,
  time: boolean,
  projectId: Project["id"],
  userOffsetMinutes: number
) {
  let due = null;
  const userOffsetHours = userOffsetMinutes / 60;

  console.log('update task dueDate', dueDate)
  console.log('offset', userOffsetHours)

  // TODO: I don't think this is working
  if (dueDate) {
    const dueWithOffset = addHours(dueDate, userOffsetHours);

    console.log('dueWithOffset', dueWithOffset)
    due = dueWithOffset.toISOString();
  }

  console.log('update task due', due)

  return prisma.task.update({
    where: { id },
    data: {
      title: title,
      description: description,
      priority: priority,
      dueDate: due,
      time: time,
      projectId: projectId,
    },
  });
}


function waitforme(millisec: number) {
  return new Promise(resolve => {
    setTimeout(() => { resolve('') }, millisec);
  })
}

export async function completeTask(id: string, userDate: Date, userOffsetMins: number) {
  let userOffsetHours = Number(userOffsetMins) / 60;

  let dateTime = format(addHours(userDate, userOffsetHours), "yyyy-MM-dd'T'HH:mm:ss.SSS") + "Z";

  await waitforme(400);

  return prisma.task.update({
    where: { id },
    data: {
      completed: true,
      completedAt: dateTime
    },
  })
}

export function restoreTask(id: string) {
  return prisma.task.update({
    where: { id },
    data: {
      completed: false,
      completedAt: null,
    },
  });
}

function formatAsISOWithoutTimezone(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "Z";
}

function getStartAndEndOfDayAdjustedForUTC(UTCDate: Date, userOffsetHours: number, userServerDifference: number, isUserDateBeforeServerDate: boolean) {
  let startTime;
  let endTime;

  if (userServerDifference === 0) {
    startTime = formatAsISOWithoutTimezone(addHours(startOfDay(UTCDate), userOffsetHours));
    endTime = formatAsISOWithoutTimezone(addHours(endOfDay(UTCDate), userOffsetHours));
  } else if (userServerDifference === 1 && isUserDateBeforeServerDate === true) {
    startTime = addHours(subDays(startOfDay(UTCDate), 1), userOffsetHours)
    endTime = addHours(subDays(endOfDay(UTCDate), 1), userOffsetHours)
  } else if (userServerDifference === 1 && isUserDateBeforeServerDate === false) {
    startTime = addHours(addDays(startOfDay(UTCDate), 1), userOffsetHours)
    endTime = addHours(addDays(endOfDay(UTCDate), 1), userOffsetHours)
  }

  return [startTime, endTime];
}

export function tasksCompletedToday({ userId }: { userId: User["id"] }, userDate: Date) {
  const userOffsetHours = Number(userDate.getTimezoneOffset()) / 60;
  const UTCDate = addHours(new Date(), userOffsetHours);
  const isUserDateBeforeServerDate = isBefore(userDate, new Date());
  const userServerDifference = differenceInCalendarDays(userDate, new Date());

  const [startTime, endTime] = getStartAndEndOfDayAdjustedForUTC(UTCDate, userOffsetHours, userServerDifference, isUserDateBeforeServerDate);

  return prisma.task.count({
    where: {
      user: {
        id: userId
      },
      completed: true,
      completedAt: {
        gte: startTime,
        lte: endTime
      },
    },
  });
}

export function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}

export async function duplicateTask(id: string) {
  const taskToDuplicate = await prisma.task.findUnique({
    where: { id },
  });

  if (taskToDuplicate && taskToDuplicate satisfies Task) {

    const { userId, title, description, priority, projectId, dueDate, time } = taskToDuplicate;

    return prisma.task.create({
      data: {
        userId: userId,
        title: title,
        description: description,
        priority: priority,
        projectId: projectId,
        dueDate: dueDate,
        time: time,
      },
    });
  }
}