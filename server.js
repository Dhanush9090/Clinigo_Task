const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config()

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
const url = process.env.MONGODB_URL;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });

const Book = require('./models/book');

// Routes
app.get('/books', (req, res) => {
    const { genre, year, rating } = req.query;
    const filter = {};

    if (genre) {
        filter.genre = genre;
    }
    if (year) {
        filter.year = year;
    }
    if (rating) {
        filter.rating = rating;
    }

    Book.find(filter)
        .then((books) => {
            res.json(books);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.get('/books/:id', (req, res) => {
    const { id } = req.params;

    Book.findById(id)
        .then((book) => {
            if (!book) {
                res.status(404).json({ error: 'Book not found' });
            } else {
                res.json(book);
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.post('/books', (req, res) => {
    const { title, author, genre, year, rating } = req.body;

    if (!title || !author || !genre || !year || !rating) {
        res.status(400).json({ error: 'Missing required property' });
        return;
    }

    const newBook = new Book({
        title,
        author,
        genre,
        year,
        rating
    });

    newBook.save()
        .then((book) => {
            res.status(201).json(book);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, genre, year, rating } = req.body;

    if (!title || !author || !genre || !year || !rating) {
        res.status(400).json({ error: 'Missing required property' });
        return;
    }

    Book.findByIdAndUpdate(id, { title, author, genre, year, rating }, { new: true })
        .then((book) => {
            if (!book) {
                res.status(404).json({ error: 'Book not found' });
            } else {
                res.json(book);
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.delete('/books/:id', (req, res) => {
    const { id } = req.params;

    Book.findByIdAndDelete(id)
        .then((book) => {
            if (!book) {
                res.status(404).json({ error: 'Book not found' });
            } else {
                res.json({ message: 'Book deleted successfully' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Internal server error' });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

