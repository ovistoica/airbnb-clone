import express from "express";
import { Booking } from "../../../models";

const stripeRouter = express.Router();

stripeRouter.post("/session", async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const amount = req.body.amount;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        name: "Booking house on Airbnb clone Ovidiu",
        amount: amount * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
    success_url: process.env.BASE_URL + "/bookings",
    cancel_url: process.env.BASE_URL + "/bookings",
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      status: "success",
      sessionId: session.id,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    })
  );
});

stripeRouter.post("/webhook", async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    console.error(err.message);
    res.end(
      JSON.stringify({
        status: "success",
        message: `Webhook Error: ${err.message}`,
      })
    );
    return;
  }

  if (event.type === "checkout.session.completed") {
    const sessionId = event.data.object.id;

    try {
      Booking.update({ paid: true }, { where: { sessionId } });
    } catch (err) {
      console.error(err);
    }
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ received: true }));
});

export default stripeRouter;
