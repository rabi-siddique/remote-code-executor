const fs = require('fs');

const languages = {
  python: '.py',
  javascript: '.js',
};

module.exports = (req, res) => {
  const { code, language } = req.body;
  const filename = __dirname + `\\Files\\main${languages[language]}`;
  fs.writeFile(filename, code, function (err) {
    console.error(err);
  });
  res.send('Hello World');
};
