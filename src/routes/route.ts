import type { FastifyInstance } from "fastify";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/register", registerController);

  app.post("/login", loginController);
}
