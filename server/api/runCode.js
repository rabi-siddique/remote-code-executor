const fs = require('fs');
const { exec } = require('child_process');

const extensions = {
  python: '.py',
  javascript: '.js',
};

const commands = {
  python: 'python',
  javascript: 'node',
};

module.exports = (req, res) => {
  const { code, language } = req.body;
  const filename = __dirname + `\\Files\\main${extensions[language]}`;
  fs.writeFile(filename, code, function (err) {
    console.error(err);
  });

  exec(`${commands[language]} ${filename}`, (error, stdout, stderr) => {
    if (error) {
      let errorMessage = error.message;
      errorMessage = errorMessage.replace('Command failed:', 'Error:');
      errorMessage = errorMessage.replace(__dirname + '\\Files\\', '');
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
