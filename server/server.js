const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const server = express();

// # Fix CORS Issues on the React Native Frontend # //
const corsOptions = {
  credentials: true,
  origin: "http://localhost/"
};

server.use(express());
server.use(express.json());
server.use(helmet());
server.use(cors(corsOptions));
// server.use(logger());

server.get("/", (req, res) => {
  res.send(`<h1>THE SERVER IS LIVE!</h1>`);
});

// # Define Routes # //

// # Logger # //
function logger(req, res, next) {
  console.log(` [${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

module.exports = server;
