import type { FastifyInstance } from "fastify";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/register", async (req, rep) => {
    registerController(req, rep);
    return rep.redirect("/index.html");
  });

  app.post("/login", async (req, rep) => {
    loginController(req, rep);
    return rep.redirect("/index.html");
  });
}
