import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import { Problem } from "./models/problemModel";

dotenv.config();

const PORT = 8000;
const server = createServer(app);

export type Location = {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
};

export type Problem = {
  service: string;
  problem: string;
  currentAddress: string;
  location: Location;
};

const socket = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_WEBSOCKET_URL,
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (connection) => {
  console.log("Client connected: ", connection.id);

  connection.on("problem", async (data) => {
    console.log(data);

    const problem = await Problem.create(data);
    if (problem) {
      socket.emit("problem", problem);
      connection.emit("problem-confirmation", {
        success: true,
        message:
          "Your Problem has been posted. Professionals will contact you soon !!",
        problemId: problem._id,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
