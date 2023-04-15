import type { User, Project, Task } from "@prisma/client";
import { addHours, differenceInCalendarDays, differenceInDays, formatISO, subHours, startOfDay, endOfDay, isBefore, subDays, addDays, format } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { l } from "vitest/dist/index-220c1d70";
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
export function getTodayTasks({ userId }: { userId: User["id"] }, tz: string) {
  const [startTime, endTime] = getStartAndEndOfDayAdjustedForUTC(tz);

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
        orderBy: { dueDate: "asc" },
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
  tz: string
) {
  let due = null;

  if (dueDate) {
    due = zonedTimeToUtc(dueDate, tz);
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
  tz: string,
) {
  let due = null;

  console.log('timezone', tz)
  console.log('update task dueDate', dueDate)

  // TODO: I don't think this is working
  if (dueDate) {
    const UTCDueDate = zonedTimeToUtc(dueDate, tz);

    console.log('UTCDueDate', UTCDueDate)
    due = formatISO(UTCDueDate)
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

function getStartAndEndOfDayAdjustedForUTC(tz: string) {
  // Convert the server to UTC
  const utcNow = zonedTimeToUtc(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Get today's date in the user's timezone
  const userNow = utcToZonedTime(utcNow, tz);

  // Get start and end of day in user's timezone
  const userStartOfDay = startOfDay(userNow);
  const userEndOfDay = endOfDay(userNow);

  // Convert start and end of day in user's timezone to UTC
  const startTime = zonedTimeToUtc(userStartOfDay, tz);
  const endTime = zonedTimeToUtc(userEndOfDay, tz);

  // console log all of the above variables
  console.log("utcNow", utcNow)
  console.log("userNow", userNow)
  console.log("userStartOfDay", userStartOfDay)
  console.log("userEndOfDay", userEndOfDay)
  console.log("startTime", startTime)
  console.log("endTime", endTime)
  console.log("tz", tz)

  return [startTime, endTime];
}

export function tasksCompletedToday({ userId }: { userId: User["id"] }, tz: string) {
  const [startTime, endTime] = getStartAndEndOfDayAdjustedForUTC(tz);

  console.log(startTime, endTime)

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

export function getTasksCompletedAllTime({ userId }: { userId: User["id"] }) {
  return prisma.task.count({
    where: {
      user: {
        id: userId
      },
      completed: true,
    },
  });
}

export async function getTasksCompletedPerProject({ userId }: { userId: User["id"] }) {
  const projects = await prisma.project.findMany({
    where: {
      user: {
        id: userId
      }
    },
    select: {
      id: true,
      name: true,
    }
  });

  if (projects && projects.length > 0) {
    let projectsTotals = [];

    for (let project of projects) {
      if (project.id.includes("none-")) continue;
      const total = await prisma.task.count({
        where: {
          user: {
            id: userId
          },
          projectId: project.id,
          completed: true,
        },
      });
      projectsTotals.push({ id: project.id, name: project.name, total: total });
    }
    return projectsTotals;
  }
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