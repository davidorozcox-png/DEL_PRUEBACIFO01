import { Schema } from 'mongoose';

const CATEGORIAS = ['portátil', 'móvil', 'tablet', 'monitor', 'auriculares', 'accesorio'];

// ESQUEMA: describe la forma de un producto y sus reglas.
// Mongoose lo usa para comprobar los datos antes de guardarlos en MongoDB.
// El _id no aparece aquí porque lo genera MongoDB automáticamente.
export const ProductoSchema = new Schema(
  {
    nombre: { type: String, trim: true, required: [true, 'nombre es obligatorio'] },
    marca: { type: String, trim: true, required: [true, 'marca es obligatoria'] },
    categoria: {
      type: String,
      required: [true, 'categoria es obligatoria'],
      enum: { values: CATEGORIAS, message: 'categoria debe ser una de: ' + CATEGORIAS.join(', ') },
    },
    precio: {
      type: Number,
      cast: 'precio debe ser un número',
      required: [true, 'precio es obligatorio'],
      min: [0, 'precio debe ser mayor o igual que 0'],
    },
    stock: {
      type: Number,
      cast: 'stock debe ser un número',
      default: 0, // si no llega, vale 0
      min: [0, 'stock debe ser mayor o igual que 0'],
      validate: { validator: Number.isInteger, message: 'stock debe ser un número entero' },
    },
    descripcion: { type: String, trim: true, default: '' },
  },
  {
    collection: 'productos', // nombre de la colección en MongoDB
    versionKey: false, // no añadir el campo interno "__v"
  },
);
