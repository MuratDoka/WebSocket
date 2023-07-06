import express from "express";
import { Server } from "socket.io";

var blobs = [];

class Blob {
  constructor(id, x, y, r) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Example app listening at http://${host}:${port}`);
}

app.use(express.static("public"));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = new Server(server);

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit("heartbeat", blobs);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  "connection",
  // We are given a websocket object in our function
  (socket) => {
    console.log(`We have a new client: ${socket.id}`);

    socket.on("start", (data) => {
      console.log(`${socket.id} ${data.x} ${data.y} ${data.r} `);
      var blob = new Blob(socket.id, data.x, data.y, data.r);
      blobs.push(blob);
    });

    socket.on("update", function (data) {
      //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
      var blob;
      for (var i = 0; i < blobs.length; i++) {
        if (socket.id == blobs[i].id) {
          blob = blobs[i];
        }
      }
      // blob.x = data.x;
      // blob.y = data.y;
      // blob.r = data.r;
    });

    socket.on("disconnect", function () {
      console.log(`Client has disconnected`);
    });
  }
);
