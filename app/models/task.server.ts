import type { User, Project, Task } from "@prisma/client";
import { addHours, formatISO, subHours } from "date-fns";
import { format } from "date-fns-tz";
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
export function getTodayTasks({ userId }: { userId: User["id"] }) {
  console.log('date init ' + new Date(new Date().setHours(0, 0, 0, 0)))
  console.log('date init2 ' + new Date(new Date().setHours(23, 59, 59, 999)))

  console.log(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"))


  return prisma.task.findMany({
    where: {
      userId,
      completed: false,
      dueDate: {
        gte: `${format(new Date(), "yyyy-MM-dd")}T00:00:00.000Z`,
        lte: `${format(new Date(), "yyyy-MM-dd")}T23:59:59.999Z`
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
    console.log('due date ' + dueDate)
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

  if (dueDate) {
    due = format(addHours(dueDate, userOffsetHours), "yyyy-MM-dd'T'HH:mm:ss.SSS") + "Z";
  }

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

export function tasksCompletedToday({ userId }: { userId: User["id"] }, userDate: Date) {
  return prisma.task.count({
    where: {
      user: {
        id: userId
      },
      completed: true,
      completedAt: {
        gte: `${format(userDate, "yyyy-MM-dd")}T00:00:00.000Z`,
        lte: `${format(userDate, "yyyy-MM-dd")}T23:59:59.999Z`
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