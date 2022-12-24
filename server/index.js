const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./apiRouter');
const bodyParser = require('body-parser');
const PORT = 3500;

// Middleware implementation for CORs
const allowList = ['http://localhost:3000'];
const corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json({ extended: true }));
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`App Running on Port: ${PORT}`);
});
