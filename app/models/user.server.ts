import type { Password, User } from "@prisma/client";
import { createProject } from "./project.server";
import { createTask } from "./task.server";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string, tz: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const personal = await createProject({ userId: user.id }, "PERSONAL", "blue");
  const work = await createProject({ userId: user.id }, "WORK", "red");
  const none = await createProject({ userId: user.id }, "NONE", "gray", `none-${user.id}`);

  // personal tasks
  await createTask(
    { userId: user.id },
    { projectId: personal.id },
    "Task with high priority",
    "",
    1,
    new Date(),
    false,
    tz
  );

  await createTask(
    { userId: user.id },
    { projectId: personal.id },
    "Task with low priority",
    "",
    3,
    new Date(new Date().setDate(new Date().getDate() + 1)),
    false,
    tz
  );

  await createTask(
    { userId: user.id },
    { projectId: personal.id },
    "Task with medium priority",
    "",
    2,
    new Date(new Date().setDate(new Date().getDate() + 4)),
    false,
    tz
  );

  // work tasks
  await createTask(
    { userId: user.id },
    { projectId: work.id },
    "Task with no priority set",
    "",
    4,
    new Date(),
    false,
    tz
  );

  await createTask(
    { userId: user.id },
    { projectId: work.id },
    "Task due next month",
    "",
    2,
    new Date(new Date().setDate(new Date().getDate() + 33)),
    false,
    tz
  );

  await createTask(
    { userId: user.id },
    { projectId: work.id },
    "Overdue task",
    "",
    1,
    new Date(new Date().setDate(new Date().getDate() - 1)),
    false,
    tz
  );

  return user;
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function deleteUserByUserId(userId: User["id"]) {
  return prisma.user.delete({ where: { id: userId } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function updateEmail(userId: User["id"], newEmail: string) {
  const isDuplicateEmail = await prisma.user.findFirst({
    where: { email: newEmail },
  });

  if (isDuplicateEmail) {
    return {
      error: "This email already exists",
    };
  }

  const response = await prisma.user.update({
    where: { id: userId },
    data: { email: newEmail },
  });

  return response;
}

export async function isCurrentPassword(
  id: User["id"],
  currentPassword: string
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { id },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return false;
  }

  const isValid = await bcrypt.compare(
    currentPassword,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return false;
  }

  return true;
}

export async function updatePassword(userId: User["id"], newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const response = await prisma.password.update({
    where: { userId: userId },
    data: { hash: hashedPassword },
  });

  return response;
}
