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

// # Stripe Stuff XD # //
const stripe = require("stripe")(process.env.YOUR_STRIPE_SECRET_KEY);

server.post("/api/doPayment/", (req, res) => {
  return stripe.charges
    .create(
      {
        amount: req.body.amount,
        currency: "usd",
        source: "tok_visa", // obtained with Stripe.js
        description: "test"
      },
      function(err, charge) {
        console.log(err, charge);
      }
    )
    .then(result => res.status(200).json(result))
    .catch(res => {
      console.log(res);
      console.log(create);
      res.status(500).json(res);
    });
});


// # Define Routes # //

// # Logger # //
// function logger(req, res, next) {
//   console.log(` [${new Date().toISOString()}] ${req.method} to ${req.url}`);
//   next();
// }

module.exports = server;
