const mongoose = require('mongoose');

// Book Schema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    rating: { type: Number, required: true }
});

module.exports = mongoose.model('Book', bookSchema);