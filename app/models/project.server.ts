import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getProjects({ userId }: { userId: User['id'] }) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { name: 'asc' }
  })
}

export function createProject({ userId }: { userId: User['id'] }, name: string, color: string) {
  return prisma.project.create({
    data: {
      userId: userId,
      name: name,
      color: color
    }
  })
}