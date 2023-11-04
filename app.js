
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const quoteRouter = require('./routes/quotes');
const scheduleRouter = require('./routes/schedules');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
} else {
  console.log('JWT_SECRET is set');
}

// testing 


// Connect to MongoDB 
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Optional: exit the application if the database connection fails
  }
}

connectToDatabase();

// CORS middleware should be set up before your routes
app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend application's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json()); // Middleware for parsing JSON bodies

// Test routes
app.get('/', (req, res) => {
  res.send('Hello, welcome to the TMS application!');
});

// Routes
app.use('/users', userRouter);
app.use('/quotes', quoteRouter);
app.use('/schedules', scheduleRouter);

// Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


