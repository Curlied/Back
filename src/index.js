const app = require('./app');
const config = require('./config/index');
const mongoose = require('mongoose');
const port = config.port || 3000;

// let connection_string = `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.url}/${config.database.name}?retryWrites=true&w=majority`
let connection_string = 'mongodb://127.0.0.1:27017/app';
mongoose.connect(connection_string).then(() => {
  console.log('Connected to MongoDB');
  app.listen(config.port, () => {
    console.log(`Server launch at http://localhost:${port}`);
  });
});