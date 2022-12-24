const fs = require('fs');
const { exec } = require('child_process');

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

  exec(`python ${filename}`, (error, stdout, stderr) => {
    if (error) {
      let errorMessage = error.message;
      errorMessage = errorMessage.replace('Command failed:', 'Error:');
      errorMessage = errorMessage.replace(__dirname + '\\Files\\', '');
      console.log(errorMessage);
      return res.send({
        error: errorMessage,
      });
    }

    if (stderr) {
      return res.send({ error: stderr });
    }

    return res.send({ output: stdout });
  });
};
