import type { FastifyRequest, FastifyReply } from "fastify";
import { authSchema } from "../utils/auth.schema";
import { loginService, registerService } from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import {
  InvalidCredentialsError,
  UserExistsError,
  UsernameNotFoundError,
} from "../utils/error";

export async function registerController(
  req: FastifyRequest,
  rep: FastifyReply
) {
  try {
    const result = authSchema.safeParse(req.body);

    if (!result.success) {
      return rep.status(400).send({
        success: false,
        message: "Invalid request",
        error: result.error.issues[0].message,
      });
    }

    const { username, password } = result.data;

    const user = await registerService(username, password);

    return rep.status(201).send({
      success: true,
      message: "Registration successful",
      username: user.username,
    });
  } catch (error) {
    if (error instanceof UserExistsError) {
      return rep.status(409).send({
        success: false,
        message: "User already exists",
      });
    }
    if (error instanceof InvalidCredentialsError) {
      return rep.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (error instanceof UsernameNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Username not found",
      });
    }
    return rep.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function loginController(req: FastifyRequest, rep: FastifyReply) {
  try {
    const result = authSchema.safeParse(req.body);

    if (!result.success) {
      return rep.status(400).send({
        success: false,
        message: "Invalid request",
        error: result.error.issues[0].message,
      });
    }

    const { username, password } = result.data;

    const user = await loginService(username, password);

    const token = generateToken(user);

    return rep.status(200).send({
      success: true,
      message: "Login successful",
      username: user.username,
      token: token,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return rep.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (error instanceof InvalidCredentialsError) {
      return rep.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (error instanceof UsernameNotFoundError) {
      return rep.status(404).send({
        success: false,
        message: "Username not found",
      });
    }
    return rep.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}
