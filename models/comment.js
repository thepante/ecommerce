const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  productId: String,
  user: String,
  description: String,
  score: Number,
  timestamp: Number,
  avatar: String,
  temp: Boolean,
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
