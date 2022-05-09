const path = require("path");
const express = require("express");
const session = require("express-session");

const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router.js");

const server = express();

server.use(express.static(path.join(__dirname, "../client")));
server.use(express.json());
server.use(express.json());
server.use(
  session({
    name: "monkey", //The name of the sessionID
    secret: "make it long and random", // the sessionID is actually encrypted
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, //in prod it should be true which make it work only in https
      httpOnly: false, // in prod make it true if possible
    },
    rolling: true, //push back expiration date every time client interate with server
    resave: false,
    saveUninitialized: false, // if false, sessions are not store by default
  })
);

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

server.use("*", (req, res, next) => {
  next({ status: 404, message: "not found!" });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
