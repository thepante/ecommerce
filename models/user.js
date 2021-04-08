const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: String,
  apellido: String,
});

// primer parámetro es el mismo que el nombre de nuestra 'colección'
const Usuario = mongoose.model('testusers', usuarioSchema);

module.exports = Usuario;