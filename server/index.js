const express = require('express');
const routes = require('./routes.js');

const app = express();

const port = 8000;

app.use(express.json());
app.use('/reviews', routes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});