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
    where: {id, userId},
    select: {tasks: true}
})
}

// KEEPING FOR REFERENCE FOR A BIT ⬇️

// export function getNote({
//   id,
//   userId,
// }: Pick<Note, "id"> & {
//   userId: User["id"];
// }) {
//   return prisma.note.findFirst({
//     select: { id: true, body: true, title: true },
//     where: { id, userId },
//   });
// }

// export function getNoteListItems({ userId }: { userId: User["id"] }) {
//   return prisma.note.findMany({
//     where: { userId },
//     select: { id: true, title: true },
//     orderBy: { updatedAt: "desc" },
//   });
// }

// export function createNote({
//   body,
//   title,
//   userId,
// }: Pick<Note, "body" | "title"> & {
//   userId: User["id"];
// }) {
//   return prisma.note.create({
//     data: {
//       title,
//       body,
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });
// }

// export function deleteNote({
//   id,
//   userId,
// }: Pick<Note, "id"> & { userId: User["id"] }) {
//   return prisma.note.deleteMany({
//     where: { id, userId },
//   });
// }
