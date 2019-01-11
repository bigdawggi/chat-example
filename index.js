var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
var port = process.env.PORT || 3000;

var stream = fs.createWriteStream("cats.txt", {flags: "a"});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
    socket.on("chat message", function(msg) {
        stream.write(msg + "\n");
        io.emit("chat message", msg);
    });

    fs.readFile("cats.txt", function(err, fileContents) {
        socket.emit("chat message", fileContents.toString());
    });
});

http.listen(port, function() {
    console.log("listening on *:" + port);
});
