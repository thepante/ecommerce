const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemSchema = new Schema({
  lastClean: Number,
  deletedComments: Number,
});

const System = mongoose.model('sys', systemSchema);

module.exports = System;
