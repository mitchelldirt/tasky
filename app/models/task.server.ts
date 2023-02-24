import type { User, Project, Task } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getAllTasks({ userId }: { userId: User["id"] }) {
  return prisma.task.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      project: true,
    },
    orderBy: { dueDate: "desc" },
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
    due = dueDate.toISOString();
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
    due = dueDate.toISOString();
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
      completedAt: new Date()
    },
  });
}

export function sayHello() {
  return "Hello";
}