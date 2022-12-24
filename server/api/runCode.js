module.exports = (req, res) => {
  const { code } = req.body;
  console.log(code);
  res.send('Hello World');
};
