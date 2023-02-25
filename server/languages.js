const extensions = {
  python: '.py',
  javascript: '.js',
  golang: '.go',
};

const commands = {
  python: 'python3',
  javascript: 'node',
  golang: 'go run',
};

const containerNames = {
  python: 'python:v1',
  javascript: 'node:v1',
  golang: 'go:v1',
};

module.exports = { extensions, commands, containerNames };
