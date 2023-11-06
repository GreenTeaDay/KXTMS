// freightviewClient.js
const request = require('request');

const freightviewClient = {
  post: (path, body) => {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        url: `https://www.freightview.com/api/v1.0${path}`,
        auth: {
          user: process.env.FREIGHTVIEW_API_KEY, // Use the API key from environment variables
        },
        headers: {
          'content-type': 'application/json'
        },
        json: body
      };

      request(options, function (error, response, body) {
        if (error) {
          return reject(error);
        }
        resolve({ data: body }); // We're emulating the structure of Axios response for consistency
      });
    });
  }
};

module.exports = freightviewClient;
