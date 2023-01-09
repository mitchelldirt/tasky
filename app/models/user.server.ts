import type { Password, User } from "@prisma/client";
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

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
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