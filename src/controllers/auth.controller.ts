import type { FastifyRequest, FastifyReply } from "fastify";
import { authSchema } from "../schemas/auth.schema";
import { loginService, registerService } from "../services/auth.service";

export async function registerController(
  req: FastifyRequest,
  rep: FastifyReply
) {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    return rep.status(400).type("text/html").send(`
    <h1>Invalid request</h1>
    <p>${result.error.issues[0].message}</p>
    <a href="/login.html">Go back</a>
  `);
  }

  const { username, password } = result.data;

  const user = await registerService(username, password);

  if (!user) {
    return rep.status(401).send({ message: "Invalid credentials" });
  }

  return rep.status(201).type("text/html").send(`
    <h1>Registration successful</h1>
    <p>User ${user.username} registered successfully.</p>
    <a href="/login.html">Go to Login</a>
  `);
}

export async function loginController(req: FastifyRequest, rep: FastifyReply) {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    return rep
      .status(400)
      .send({ message: "Invalid request data", errors: result.error });
  }

  const { username, password } = result.data;

  const user = await loginService(username, password);
  if (!user) {
    return rep.status(401).send({ message: "Invalid credentials" });
  }

  return rep.status(200).type("text/html").send(`
    <h1>Login successful</h1>
    <p>Welcome back, ${user.username}!</p>
    <a href="/index.html">Go to Chat</a>
  `);
}
