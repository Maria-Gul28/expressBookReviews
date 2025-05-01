const express = require('express');
const axios = require('axios'); // Add axios requirement
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to simulate async book fetching (in real app, this would call an API)
const getBooksAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 500); // Simulate async delay
  });
};

// Task 10: Get all books using async/await
public_users.get('/', async function (req, res) {
  try {
    const books = await getBooksAsync();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book by ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const books = await getBooksAsync();
    const book = books[isbn];
    
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching book by ISBN"});
  }
});
  
// Task 12: Get books by author using async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const books = await getBooksAsync();
    const booksByAuthor = {};
    
    for (const [isbn, book] of Object.entries(books)) {
      if (book.author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor[isbn] = book;
      }
    }
    
    if (Object.keys(booksByAuthor).length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Task 13: Get books by title using async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const books = await new Promise((resolve) => {
      setTimeout(() => resolve(require("./booksdb.js")), 1000);
    });

    const result = {};
    for (const [isbn, book] of Object.entries(books)) {
      if (book.title.toLowerCase().includes(title.toLowerCase())) {
        result[isbn] = book;
      }
    }

    if (Object.keys(result).length > 0) res.status(200).json(result);
    else res.status(404).json({message: "No books found"});
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
});
// At the bottom of general.js, replace:
module.exports.general = public_users;

// With:
module.exports = {
    general: public_users
};
// (Rest of the file remains the same - Tasks 5,6)
