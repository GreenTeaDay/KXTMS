const axios = require('axios');
require('dotenv').config();

if (!process.env.FREIGHTVIEW_API_KEY) {
  console.error('FREIGHTVIEW_API_KEY is not set in the environment variables');
  process.exit(1);
}

const freightviewClient = axios.create({
  baseURL: 'https://api.freightview.com/v1.0',
  headers: {
    'Authorization': `Bearer ${process.env.FREIGHTVIEW_API_KEY}`
  }
});

module.exports = freightviewClient;



//'https://api.freightview.com/v1.0'    https://www.freightview.com/api/rates  