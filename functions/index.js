const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51IgPOYI2LM9IW1imdsMGZBk42BND3g8W3lXmcBr9GTIYLiNtWe739tUYvElMy0JTcqTrGqUl9sBsGlYJBefcNY3800WdQ25Whr");

// -------------API----------------

// App config
const app = express();

// Middlewares
app.use(cors({ origin: true}));
app.use(express.json());

// API routes
app.get("/", (req,res) =>{
    res.status(200).send("hello world");
});

app.post("/payments/create", async (req,res) =>{
    const { total } = req.query;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd"
    });

    res.status(201).send({
        clientSecret: paymentIntent.client_secret
    });
});

// Listen
exports.api = functions.https.onRequest(app);


// http://localhost:5001/clone-45878/us-central1/api
