// server.js
require('dotenv').config(); // lädt Variablen aus .env (nur lokal, nicht in Prod)
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json()); // um JSON-Bodies zu parsen

// Endpoint zum Erstellen eines Connection Tokens für Stripe Terminal
app.post('/connection_token', async (req, res) => {
  try {
    const token = await stripe.terminal.connectionTokens.create();
    res.json({ secret: token.secret });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Endpoint zum Erfassen eines PaymentIntents
app.post('/capture_payment_intent', async (req, res) => {
  const { payment_intent_id } = req.body;
  try {
    const intent = await stripe.paymentIntents.capture(payment_intent_id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(402).send(err.message);
  }
});

// Starte den Server auf dem von Render vorgegebenen Port oder 4242 (lokal)
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
