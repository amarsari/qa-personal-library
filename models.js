const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
   // bookId: { type: String, required: true },
    title: { type: String, required: true },
    comments: [{ type: String }],
  //  commentCount: { type: Number, default: 0 }
});

const Book = mongoose.model('Book', bookSchema);

exports.Book = Book;