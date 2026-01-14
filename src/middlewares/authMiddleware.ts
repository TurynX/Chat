import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(req: FastifyRequest, rep: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return rep.status(401).send({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;
  } catch (err) {
    return rep.status(401).send({ message: "Invalid token" });
  }
}
