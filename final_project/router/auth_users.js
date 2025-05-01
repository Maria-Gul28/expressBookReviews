const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Task 7: Login for registered users
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid credentials"});
  }

  const accessToken = jwt.sign({username}, "access", {expiresIn: "1h"});
  req.session.authorization = {accessToken};
  
  return res.status(200).json({
    message: "Login successful",
    token: accessToken
  });
});

// Task 8: Add/update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review; // Using query parameter for review
  const username = req.user.username; // From JWT

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!reviewText) {
    return res.status(400).json({message: "Review text is required"});
  }

  // Initialize reviews object if it doesn't exist
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add/update the review
  books[isbn].reviews[username] = reviewText;
  
  return res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn]
  });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({message: "Review not found for this user"});
  }

  // Delete the review
  delete books[isbn].reviews[username];
  
  return res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbn]
  });
});

// At the bottom of auth_users.js, replace:
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

// With:
module.exports = {
    authenticated: regd_users,
    isValid: isValid,
    users: users
};
