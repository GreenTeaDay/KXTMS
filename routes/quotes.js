const express = require('express');
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');
const freightviewClient = require('../freightviewClient');

const router = express.Router();

// Create a new quote - shortened to '/' for clearer POSTMAN Url post request
router.post('/', auth, async (req, res) => {
  try {
    // Create a new quote in your database
    const quote = new Quote({
      ...req.body,
      customerId: req.user._id
    });
    await quote.save();

    // Fetch quotes from Freightview
    const payload = {
      originPostalCode: req.body.originPostalCode,
      destPostalCode: req.body.destPostalCode,
      items: req.body.items
    };
    
    const response = await freightviewClient.post('/rates', payload);
    const freightviewQuotes = response.data;

    // Send back the combined data
    res.status(201).send({ quote, freightviewQuotes });
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to create quote. Error: ' + e.message);
  }
});


// Get all quotes
router.get('/', auth, async (req, res) => {
  try {
    const quotes = await Quote.find({ ownerId: req.user._id });
    res.send(quotes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch the quote' });
  }
});

// Get a specific quote by id
router.get('/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const quote = await Quote.findOne({ _id, ownerId: req.user._id });
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.send(quote);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch the quote' });
  }
});

// Update a quote by id
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const quote = await Quote.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    updates.forEach(update => quote[update] = req.body[update]);
    await quote.save();
    res.send(quote);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Failed to update the quote' });
  }
});

// Delete a quote
router.delete('/:id', auth, async (req, res) => {
  try {
    const quote = await Quote.findOne({ _id: req.params.id, ownerId: req.user._id });
if (!quote) {
  return res.status(404).json({ error: 'Quote not found' });
}

    res.send(quote);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Something went wrong' });
  }

  
});

;

// ... other endpoints remain the same

module.exports = router;
