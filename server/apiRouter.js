const router = require('express').Router();
const runCode = require('./api/runCode');

router.post('/run-code', runCode);

module.exports = router;
