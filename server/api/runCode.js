const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const extensions = {
  python: '.py',
  javascript: '.js',
};

const commands = {
  python: 'python3',
  javascript: 'node',
};

const containerNames = {
  python: 'python:v1',
  javascript: 'js:v1',
};

module.exports = (req, res) => {
  const { code, language } = req.body;

  const filename = path.join(__dirname, 'Files', `main${extensions[language]}`);
  fs.writeFile(filename, code, function (err) {
    if (err) {
      console.error(err);
      return res.send({
        error: 'Error writing file',
      });
    }
  });

  exec(`docker run -d ${containerNames[language]}`, (error, stdout, stderr) => {
    let containerID = stdout;
    exec(
      `docker cp ${filename} ${containerID.trim()}:/app`,
      (error, stdout, stderr) => {
        exec(
          `docker exec -t ${containerID.trim()} bash -c "${
            commands[language]
          } main${extensions[language]}"`,
          (error, stdout, stderr) => {
            console.log({ error, stdout, stderr });
            if (error) {
              let errorMessage = error.message;
              errorMessage = errorMessage.replace('Command failed:', 'Error:');
              errorMessage = errorMessage.replace(`${__dirname}/Files/`, '');
              return res.send({
                error: errorMessage,
              });
            }

            if (stderr) {
              return res.send({ error: stderr });
            }

            return res.send({ output: stdout });
          }
        );
      }
    );
  });
};
