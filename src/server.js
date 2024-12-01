import "dotenv/config";
import http from "http";
import app from "./app.js";

const server = http.createServer(app);

const serverListening = () => {
  console.log(`Server is listening on port ${process.env.PORT} 🔥`);
};
server.listen(process.env.PORT, serverListening);

export default server;
