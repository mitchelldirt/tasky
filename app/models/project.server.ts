import type { User, Project } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getProjects({ userId }: { userId: User["id"] }) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export function getProjectById({ projectId }: { projectId: Project["id"] }) {
  return prisma.project.findFirst({
    where: { id: projectId },
  });
}

export function createProject(
  { userId }: { userId: User["id"] },
  name: string,
  color: string,
  id?: string
) {
  let data = {
    userId: userId,
    name: name.toUpperCase(),
    color: color
  }

  if (id) {
    data = Object.assign(data, { id: id });
  }

  return prisma.project.create({
    data: data
  });
}

export function editProject({
  id,
  name,
  color,
}: Pick<Project, "id" | "name" | "color">) {
  return prisma.project.update({
    data: {
      id: id,
      name: name,
      color: color,
    },

    where: {
      id: id,
    },
  });
}

export function deleteProject({ id }: { id: Project["id"] }) {
  return prisma.project.delete({
    where: {
      id: id,
    },
  });
}
