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

server.get("/", (req, res) => {
  res.send(`<h1>THE SERVER IS LIVE!</h1>`);
});

// # Stripe Stuff XD # //
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

server.post("/api/doPayment", async (req, res) => {
  // Stripe takes in amount by cents, which means if you are charging $4.50
  // the amount sent to stripe would be 450. Hence the rounding and multiplying by 100 below
  const number = parseFloat(req.body.totalAmount).toFixed(2)
  const amount = Math.round(number * 100)

  return stripe.charges
    .create(
      {
        // Amount is required
        // Currency is a required field.
        amount: amount,
        currency: "USD",
        source: req.body.token, // obtained with Stripe.js
        description: req.body.description,

        // NOTE: transfer_data is to send money to specific accounts on a connect Stripe Platform.
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

module.exports = server;
