import type { User, Project } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getAllTasks({ userId }: { userId: User["id"] }) {
  return prisma.task.findMany({
    where: { userId },
    select: { id: true, title: true, description: true, priority: true, project: true },
    orderBy: { dueDate: 'desc' }
  })
}

export function getProjects({ userId }: { userId: User['id'] }) {
  return prisma.project.findMany({
    where: { userId },
    select: { id: true, name: true, color: true },
    orderBy: { name: 'desc' }
  })
}

export function getProjectTasks({ id, userId }: Pick<Project, 'id'> & { userId: User['id'] }) {
  return prisma.project.findMany({
    where: { id, userId },
    select: { tasks: true }
  })
}

export function createTask({ userId }: { userId: User['id'] }, title: string, description: string, priority: number) {
  return prisma.task.create({
    data: {
      userId: userId,
      title: title,
      description: description,
      priority: priority
    }
  })
}