const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
