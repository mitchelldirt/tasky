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

export async function createUser(email: User["email"], password: string) {
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

  const personal = await createProject({ userId: user.id }, 'Personal', 'blue');
  const work = await createProject({ userId: user.id }, 'Work', 'red');

  // personal tasks
  await createTask({ userId: user.id }, 'Do yoga', 'Choose a yoga video with a focus on hip flexibility', 5, { projectId: personal.id });
  await createTask({ userId: user.id }, 'Vacuum', '', 5, { projectId: personal.id });
  await createTask({ userId: user.id }, 'Plan vacation', 'Figure out how much it will cost for a 5 night stay in Minneapolis', 5, { projectId: personal.id });

  // work tasks
  await createTask({ userId: user.id }, 'Clean off desk', '', 2, { projectId: work.id });
  
  await createTask({ userId: user.id }, 'Ship version 1.0 of app', '', 5, { projectId: work.id });

  return user;
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
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
    where: { email: newEmail }
  });

  if (isDuplicateEmail) {
    return {
      error: 'This email already exists'
    }
  }


  const response = await prisma.user.update({
    where: { id: userId },
    data: { email: newEmail }
  })

  return response
}

export async function isCurrentPassword(id: User['id'], currentPassword: string) {
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
    data: { hash: hashedPassword }
  })

  return response;
}