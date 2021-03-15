const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const homeSchema = new Schema({
  name: String,
  description: String,
  count: Number,
  image: String,
});

const Home = mongoose.model('home', homeSchema, 'home');

module.exports = Home;
