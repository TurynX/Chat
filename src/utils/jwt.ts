import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { AuthPayload } from "../types/fastify";

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export function generateToken(user: User) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, SECRET);

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  return decoded as AuthPayload;
}
