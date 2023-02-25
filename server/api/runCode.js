const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const { extensions, commands, containerNames } = require('../languages');
const path = require('path');
const execPromise = promisify(exec);

module.exports = async (req, res) => {
  const { code, language } = req.body;

  try {
    const { stdout: id } = await execPromise(
      `docker run -d -it ${containerNames[language]} /bin/bash`
    );
    const filename = path.join(
      __dirname,
      `${id.substring(0, 12)}${extensions[language]}`
    );
    await fs.promises.writeFile(filename, code);

    let containerID = id.substring(0, 12);

    const { stdout, stderr } = await execPromise(
      `docker cp ${filename} ${containerID}:/app && docker exec -t ${containerID} bash -c "${commands[language]} ${containerID}${extensions[language]}"`,
      { timeout: 20000, maxBuffer: 50000 }
    );

    await exec(`docker kill ${containerID}`);
    await fs.promises.unlink(filename);

    if (stdout) {
      return res.send({ output: stdout });
    } else {
      return res.send({
        error: 'Something Went Wrong. Please try again later.',
      });
    }
  } catch (error) {
    console.log('ERROR', error);
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
