const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
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
