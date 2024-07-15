import express from "express";
const app = express();
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const PORT = 4000;
const httpServer = new createServer(app);

const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function (req, resp) {
  resp.render("index");
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.listen(process.env.PORT || 4000, () => {
//   console.log(`Server Running on PORT Number is ${process.env.PORT}`);
// });
