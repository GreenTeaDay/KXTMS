// quotes.js
const express = require('express');
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');
const freightviewClient = require('../freightviewClient');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    // Step 1: Create a new quote in your database
    let quote = new Quote({
      ...req.body,
      customerId: req.user._id
    });
    await quote.save();

    // Step 2: Fetch quotes from Freightview
    const payload = {
      originPostalCode: req.body.originPostalCode,
      destPostalCode: req.body.destPostalCode,
      items: req.body.items
    };
    
    const response = await freightviewClient.post('/rates', payload);
    const freightviewQuotes = response.data;

    // Step 3: (Optional) Update the saved quote with rates received
    // This is where you would add any additional logic to update the quote with the rates received.
    // For example:
    // quote.rates = freightviewQuotes;
    // await quote.save();

    // Step 4: Send back the combined data
    res.status(201).send({ quote: quote.toObject(), freightviewQuotes });
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to create quote. Error: ' + e.message);
  }
});

// ... keep the other endpoints as they are

module.exports = router;
