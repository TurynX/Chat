import fastify from "fastify";
import { Server } from "socket.io";
import fastifyStatic from "@fastify/static";
import { appRoutes } from "./routes/route";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { fileURLToPath } from "url";
import path from "path";
import { verifyToken } from "./utils/jwt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
  const app = fastify();

  app.register(fastifyStatic, {
    root: `${__dirname}/../public`,
    prefix: "/",
  });

  await app.register(formbody);

  await app.register(cors, { origin: "*" });

  app.register(appRoutes);

  const SECRET = process.env.JWT_SECRET || "supersecretkey";

  const server = app.server;

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const payload = jwt.verify(token, SECRET);
      socket.data.user = payload;
      next();
    } catch {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.data.user);

    socket.on("joinRoom", ({ roomName }) => {
      socket.join(roomName);
      socket.emit("system");
    });

    socket.on("message", ({ roomName, content }) => {
      const msg = {
        roomName,
        username: socket.data.user.username,
        content,
        createdAt: new Date().toLocaleTimeString(),
      };
      io.to(roomName).emit("message", msg);
    });
  });

  app.listen({ port: 3000 }, () => {});
}
main();
