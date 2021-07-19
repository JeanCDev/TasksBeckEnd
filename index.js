const express = require('express')
const app = express();
const consign = require('consign');
require('dotenv/config');

consign()
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./api')
  .then('./config/routes.js')
  .into(app);

app.listen(3000, () => {
  console.log('Server online');
});