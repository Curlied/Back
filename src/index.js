const app = require('./app');
const config = require('./config/index');
const mongoose = require('mongoose');
const port = config.port || 3000;

let connection_string = `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.url}/${config.database.name}?retryWrites=true&w=majority`;
mongoose.connect('mongodb://localhost:27017/app').then(() => {
  console.log('Connected to MongoDB');
  app.listen(config.port, () => {
    console.log(`Server launch at http://localhost:${port}`);
  });
});