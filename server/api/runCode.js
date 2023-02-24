const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const { extensions, commands, containerNames } = require('../languages');
const path = require('path');
const execPromise = promisify(exec);

module.exports = async (req, res) => {
  const { code, language } = req.body;
  const filename = path.join(__dirname, 'files', `main${extensions[language]}`);
  try {
    await fs.promises.writeFile(filename, code);
  } catch (err) {
    console.error(err);
    return res.send({
      error: 'Error writing file',
    });
  }

  try {
    const { stdout: id } = await execPromise(
      `docker run -d -it ${containerNames[language]} /bin/bash`
    );

    let containerID = id.substring(0, 12);

    const { stdout, stderr } = await execPromise(
      `docker cp ${filename} ${containerID}:/app && docker exec -t ${containerID} bash -c "${commands[language]} main${extensions[language]}"`,
      { timeout: 20000, maxBuffer: 50000 }
    );

    await exec(`rm ${filename}`);
    await exec(`docker kill ${containerID}`);

    if (stderr) {
      return res.send({ error: stderr });
    }

    return res.send({ output: stdout });
  } catch (error) {
    console.error(error);
    let errorMessage = error.message;
    errorMessage = errorMessage.replace('Command failed:', 'Error:');
    errorMessage = errorMessage.replace(`${__dirname}/files/`, '');
    return res.send({
      error: errorMessage,
    });
  }
};
