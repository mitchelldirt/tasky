import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getProjects({ userId }: { userId: User['id'] }) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { name: 'desc' }
  })
}