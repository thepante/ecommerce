const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  articles: Array,
});

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;
