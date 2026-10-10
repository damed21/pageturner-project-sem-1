const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// GET ALL BOOKS
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get books",
      error: error.message,
    });
  }
});

// GET ONE BOOK
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get book",
      error: error.message,
    });
  }
});

// ADD A NEW BOOK
router.post("/", async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      description: req.body.description,
      publishedYear: req.body.publishedYear,
      image: req.body.image,
    });

    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
});

// ADD COMMENT AND RATING
router.post("/:id/comments", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const newComment = {
      user: req.body.user,
      text: req.body.text,
      rating: req.body.rating,
    };

    book.comments.push(newComment);

    const totalRatings = book.comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );

    book.ratingCount = book.comments.length;
    book.averageRating = totalRatings / book.ratingCount;

    await book.save();

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
});

// DELETE BOOK
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
});

module.exports = router;