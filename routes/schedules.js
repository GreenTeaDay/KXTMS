const express = require('express');
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');
const freightviewClient = require('../freightviewClient');


const router = express.Router();

// Create a new schedule
router.post('/schedules', auth, async (req, res) => {
  try {
    const schedule = new Schedule({
      ...req.body,
      ownerId: req.user._id
    });
    await schedule.save();
    res.status(201).send(schedule);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all schedules
router.get('/schedules', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ ownerId: req.user._id });
    res.send(schedules);
  } catch (e) {
    res.status(500).send();
  }
});

// Get a specific schedule by id
router.get('/schedules/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const schedule = await Schedule.findOne({ _id, ownerId: req.user._id });
    if (!schedule) {
      return res.status(404).send();
    }
    res.send(schedule);
  } catch (e) {
    res.status(500).send();
  }
});

// Update a schedule by id
router.patch('/schedules/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id, ownerId: req.user._id });
    if (!schedule) {
      return res.status(404).send();
    }
    updates.forEach(update => schedule[update] = req.body[update]);
    await schedule.save();
    res.send(schedule);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete a schedule
router.delete('/schedules/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    if (!schedule) {
      res.status(404).send();
    }
    res.send(schedule);
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/schedules', auth, async (req, res) => {
  try {
    // Create a new schedule in your database
    const schedule = new Schedule({
      ...req.body,
      ownerId: req.user._id
    });
    await schedule.save();

    // Initiate schedule with Freightview - talk with CEO to flesh this part out a bit more
    const payload = {
      "originPostalCode": "66204",
      "destPostalCode": "55016",
      "items": [
        {
          "weight": 15,
          "package": "Custom"
        }
      ]
    };
    const response = await freightviewClient.post('/schedulePickup', payload);
    const freightviewScheduleConfirmation = response.data;

    // Send back the combined data
    res.status(201).send({ schedule, freightviewScheduleConfirmation });
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to create schedule and initiate with freightview');
  }
});


module.exports = router;
