const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const { extensions, commands, containerNames } = require('../languages');
const path = require('path');
const execPromise = promisify(exec);
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

async function cleanup(containerID, filename) {
  await execPromise(`docker kill ${containerID}`);
  await fs.promises.unlink(filename);
}

module.exports = async (req, res) => {
  const { code, language } = req.body;

  let containerID;
  let filename;

  try {
    // Check if output is already cached
    const cacheKey = `${code}_${language}`;
    const cachedOutput = cache.get(cacheKey);
    if (cachedOutput) {
      return res.send({ output: cachedOutput });
    }

    const { stdout: id } = await execPromise(
      `docker run -d -it ${containerNames[language]} /bin/bash`
    );
    containerID = id.substring(0, 12);

    filename = path.join(__dirname, `${containerID}${extensions[language]}`);
    await fs.promises.writeFile(filename, code);

    const { stdout, stderr } = await execPromise(
      `docker cp ${filename} ${containerID}:/app && docker exec -t ${containerID} bash -c "${commands[language]} ${containerID}${extensions[language]}"`,
      { timeout: 20000, maxBuffer: 50000 }
    );

    await cleanup(containerID, filename);

    if (stdout) {
      // Cache the output
      cache.set(cacheKey, stdout);
      return res.send({ output: stdout });
    } else {
      return res.send({
        error: 'Something Went Wrong. Please try again later.',
      });
    }
  } catch (error) {
    await cleanup(containerID, filename);
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
