const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// 📌 Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  let userExists = users.filter(user => user.username === username).length > 0;
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. You can now login." });
});


// ========== ORIGINAL TASKS (Synchronous) ==========
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book);
  else return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = [];
  for (let key in books) {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  }
  if (result.length > 0) return res.status(200).json(result);
  else return res.status(404).json({ message: "No books found for this author" });
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = [];
  for (let key in books) {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  }
  if (result.length > 0) return res.status(200).json(result);
  else return res.status(404).json({ message: "No books found with this title" });
});

// 📌 Task 5 remains same
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) return res.status(200).json(book.reviews);
  else return res.status(404).json({ message: "No reviews found for this book" });
});


// ========== TASKS 10–13: Async Version ==========

// 📌 Task 10: Get book list (using Promise)
public_users.get('/async/books', function (req, res) {
  let getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  });

  getBooks.then(
    (result) => res.status(200).json(result),
    (error) => res.status(500).json({ message: error })
  );
});

// 📌 Task 11: Get book details by ISBN (async/await)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    let getBookByISBN = new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    });

    const book = await getBookByISBN;
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// 📌 Task 12: Get book details by Author (async/await)
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

    let getBooksByAuthor = new Promise((resolve, reject) => {
      let result = [];
      for (let key in books) {
        if (books[key].author === author) {
          result.push(books[key]);
        }
      }
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });

    const result = await getBooksByAuthor;
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// 📌 Task 13: Get book details by Title (async/await)
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

    let getBooksByTitle = new Promise((resolve, reject) => {
      let result = [];
      for (let key in books) {
        if (books[key].title === title) {
          result.push(books[key]);
        }
      }
      if (result.length > 0) resolve(result);
      else reject("No books found with this title");
    });

    const result = await getBooksByTitle;
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
