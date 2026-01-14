import { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/password";
import {
  UserExistsError,
  InvalidCredentialsError,
  UsernameNotFoundError,
} from "../utils/error";

const prisma = new PrismaClient();

export async function registerService(username: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new UserExistsError();
  }

  const hashedPassword = await hashPassword(password);

  if (!hashedPassword) {
    throw new InvalidCredentialsError();
  }

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  return user;
}

export async function loginService(username: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { username },
  });
  if (!user) {
    throw new UsernameNotFoundError();
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  return user;
}
