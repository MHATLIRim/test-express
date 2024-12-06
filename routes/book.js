const express = require('express');
const router = express.Router();
const { Book, bookValidationSchema } = require('../models/Book');

// Route pour ajouter un livre
router.post('/add', async (req, res) => {
  try {
    await bookValidationSchema.validate(req.body);
    const { title, author, genre, price, available } = req.body;
    const newBook = new Book({ title, author, genre, price, available });
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error });
  }
});

// Route pour obtenir tous les livres
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

// Route pour supprimer un livre
router.delete('/delete/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
});

// Route pour mettre à jour un livre
router.put('/edit/:id', async (req, res) => {
  try {
    await bookValidationSchema.validate(req.body);
    const { title, author, genre, price, available } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, genre, price, available }, { new: true });
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error });
  }
});

// Route pour filtrer les livres par genre
router.get('/filterByGenre/:genre', async (req, res) => {
  try {
    const books = await Book.find({ genre: req.params.genre });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering books', error });
  }
});

// Route pour acheter un livre avec une réduction
router.post('/buyWithDiscount/:id', async (req, res) => {
  try {
    const { discount } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book.available) {
      return res.status(400).json({ message: 'Book not available' });
    }
    book.price = book.price - (book.price * (discount / 100));
    book.available = false;
    await book.save();
    res.status(200).json({ message: 'Book purchased successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing book', error });
  }
});

// Route pour obtenir le nombre de livres disponibles
router.get('/availableCount', async (req, res) => {
  try {
    const availableBooksCount = await Book.countDocuments({ available: true });
    res.status(200).json({ count: availableBooksCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available books count', error });
  }
});

module.exports = router;