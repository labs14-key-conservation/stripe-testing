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
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

server.post("/api/doPayment", async (req, res) => {
  const number = parseFloat(req.body.totalAmount).toFixed(2)
  const amount = Math.round(number * 100)
  
  return stripe.charges
    .create(
      {
        // Amount is required
        // Currency is a required field.
        amount: amount,
        currency: "usd",
        source: req.body.token, // obtained with Stripe.js
        description: req.body.description,

        // transfer_data: {
        //
        //   amount: parseInt(req.body.orgAmount, 10),
        //
        //   destination: req.body.campaign.stipeAcountId
        // }
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
