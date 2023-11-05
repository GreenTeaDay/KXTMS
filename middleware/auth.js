const jwt = require('jsonwebtoken');



const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).send({ error: 'No token provided.' });
    }
    if (!token.startsWith('Bearer ')) {
      return res.status(401).send({ error: 'Invalid token format.' });
    }
    const jwtToken = token.replace('Bearer ', '').trim();
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
    console.log(e);
  }
};

module.exports = auth;
