/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models').Book; // Import the Book model

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) =>{
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({});
        if(!books){
          res.json([]);
          return;
        }

        const formatData = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          };
        });
        res.json(formatData);
        return;
      } catch (error) {
        res.json([]);
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      
      if(!title) {
        res.send('missing required field title');
        return;
      }

      const newBook = new Book({ title, comments: []});
      try {
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title });
      } catch (error) {
        console.error('Error saving book:', error);
        res.send("there was an error saving");
      }
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try{
        const deleted = await Book.deleteMany({});
        res.send("complete delete successful");
        
      } catch (error) {
        res.send("There was an error deleting");
        
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookID = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try{
        const book = await Book.findById(bookID);
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        });
      } catch (error) {
        res.send("no book exists");
        return;
      }
    })
    
    .post(async (req, res) => {
      let bookID = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment) {
        res.send('missing required field comment');
        return;
      }

      try{
        let book = await Book.findById(bookID);
        book.comments.push(comment);
        book = await book.save();
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        });
      } catch (error) {
        res.send("no book exists");
      }
    })
    
    .delete(async (req, res) => {
      let bookID = req.params.id;
      //if successful response will be 'delete successful'
      try{
        const book = await Book.findByIdAndDelete(bookID);
        if(!book) {
          res.send("no book exists");
          return;
        }
        res.send("delete successful");
      } catch (error) {
        res.send("no book exists");
      }
    });
  
};
