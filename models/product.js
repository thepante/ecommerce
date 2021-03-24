const { customAlphabet } = require('nanoid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

const productSchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  category: Object,
  name: String,
  briefDesc: String,
  description: String,
  currency: String,
  cost: Number,
  soldCount: Number,
  images: Array,
  related: Array,
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
