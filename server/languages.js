const extensions = {
  python: '.py',
  javascript: '.js',
  go: '.go',
};

const commands = {
  python: 'python3',
  javascript: 'node',
  go: 'go run',
};

const containerNames = {
  python: 'python:v1',
  javascript: 'node:v1',
  go: 'go:v1',
};

module.exports = { extensions, commands, containerNames };
