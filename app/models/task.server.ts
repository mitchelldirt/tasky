import type { User, Project, Task } from "@prisma/client";
import { formatISO } from "date-fns";
import { format } from "date-fns-tz";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getAllTasks({ userId }: { userId: User["id"] }) {
  return prisma.task.findMany({
    where: { userId, completed: false },
    orderBy: { dueDate: "asc" },
  });
}

export function getAllCompletedTasks({ userId }: { userId: User["id"] }) {
  return prisma.task.findMany({
    orderBy: { completedAt: "asc" },
    where: { user: {
      id: userId
    }, completed: true },
  });
}

export function getTodayTasks({ userId }: { userId: User["id"] }) {
  console.log('date init ' + new Date(new Date().setHours(0, 0, 0, 0)))
  console.log('date init2 ' + new Date(new Date().setHours(23, 59, 59, 999)))

  console.log( format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"))
  

  return prisma.task.findMany({
    where: {
      userId,
      completed: false,
      dueDate: {
        gte: `${format(new Date(), "yyyy-MM-dd")}T00:00:00.000Z`,
        lte: `${format(new Date(), "yyyy-MM-dd")}T23:59:59.999Z`
      },
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
  time: boolean
) {
  let due = null;
  if (dueDate) {
    // ! When you formatISO with a time zone it will return a string with the time zone offset. The below code will remove the time zone offset and add a Z to the end of the string. This is required for the dueDate to be stored in the database correctly.
    due = formatISO(dueDate).split('-').slice(0, 3).join('-');
    if (due.includes('Z') === false) {
      due = due + 'Z';
    }
    console.log('LOG POINT - this is what the due date is before going into the db: ', due)
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
  projectId: Project["id"]
) {
  let due = null;
  if (dueDate) {
    due = format(dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSS") + "Z";
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

export function completeTask(id: string) {
  console.log("id", id);
  return prisma.task.update({
    where: { id },
    data: {
      completed: true,
      completedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS") + "Z",
    },
  });
}

export function tasksCompletedToday({ userId }: { userId: User["id"]}) {
  return prisma.task.count({
    where: {
      user: {
        id: userId
      },
      completed: true,
      completedAt: {
        gte: `${format(new Date(), "yyyy-MM-dd")}T00:00:00.000Z`,
        lte: `${format(new Date(), "yyyy-MM-dd")}T23:59:59.999Z`
      },
    },
  });
}