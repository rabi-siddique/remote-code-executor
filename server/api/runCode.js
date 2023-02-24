const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const path = require('path');
const execPromise = promisify(exec);

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

module.exports = async (req, res) => {
  const { code, language } = req.body;
  const filename = path.join(__dirname, 'Files', `main${extensions[language]}`);
  try {
    await fs.promises.writeFile(filename, code);
  } catch (err) {
    console.error(err);
    return res.send({
      error: 'Error writing file',
    });
  }

  try {
    const { stdout: containerID } = await execPromise(
      `docker run -d -it ${containerNames[language]}`
    );

    await execPromise(`docker cp ${filename} ${containerID.trim()}:/app`);
    const { stdout, stderr } = await execPromise(
      `docker exec -t ${containerID.trim()} bash -c "${
        commands[language]
      } main${extensions[language]}"`
    );

    if (stderr) {
      return res.send({ error: stderr });
    }

    return res.send({ output: stdout });
  } catch (error) {
    console.error(error);
    let errorMessage = error.message;
    errorMessage = errorMessage.replace('Command failed:', 'Error:');
    errorMessage = errorMessage.replace(`${__dirname}/Files/`, '');
    return res.send({
      error: errorMessage,
    });
  }
};
