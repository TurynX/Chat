import fastify from "fastify";
import { Server } from "socket.io";
import fastifyStatic from "@fastify/static";
import { appRoutes } from "./routes/route";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { fileURLToPath } from "url";
import path from "path";

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

  const server = app.server;

  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    socket.on("joinRoom", ({ roomName }) => {
      socket.join(roomName);
      socket.emit("system", { text: `Joined room ${roomName}` });
    });

    socket.on("message", ({ roomName, username, content }) => {
      io.to(roomName).emit("message", {
        roomName,
        username,
        content,
        createdAt: new Date().toLocaleTimeString(),
      });
    });
  });

  app.listen({ port: 3000 }, () => {});
}
main();
