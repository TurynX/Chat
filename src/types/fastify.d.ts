import fastify from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthPayload;
  }
}

export interface AuthPayload extends JwtPayload {
  id: string;
  username: string;
}
