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
    return res.send({
      error: 'Something went wrong. Please try again later.',
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

    await exec(`docker kill ${containerID}`);

    if (stdout) {
      return res.send({ output: stdout });
    } else {
      return res.send({
        error: 'Something Went Wrong. Please try again later.',
      });
    }
  } catch (error) {
    if (error.stdout) {
      return res.send({
        error: error.stdout,
      });
    } else {
      return res.send({
        error: 'Something Went Wrong. Please try again later.',
      });
    }
  }
};
