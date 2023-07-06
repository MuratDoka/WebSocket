var socket;

var blob;
var id;

var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);

  socket = io.connect("http://localhost:3000");

  blob = new Blob(random(width), random(height), random(8, 24));

  //Make a little object with x and y
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
  };
  socket.emit("start", data);

  socket.on("heartbeat", (data) => {
    //console.log(data);
    blobs = data;
  });
}

function draw() {
  background(0);
  console.log(blob.pos.x, blob.pos.y);

  translate(width / 2, height / 2);
  var newZoom = 64 / blob.r;
  zoom = lerp(zoom, newZoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  for (var i = blobs.length - 1; i >= 0; i--) {
    var id = blobs[i].id;
    if (id.substring(2, id.length) !== socket.id) {
      fill(0, 0, 255);
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

      fill(255);
      textAlign(CENTER);
      textSize(3);
      text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r);
    }
    // blobs[i].show();
    // if (blob.eats(blobs[i])) {
    //   blobs.splice(i, 1);
    // }
  }

  blob.show();
  if (mouseIsPressed) {
    blob.update();
  }

  blob.constrain();

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
  };
  socket.emit("update", data);
}
