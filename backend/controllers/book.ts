import { Request, Response } from 'express';
import Book from '../models/book';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookByISBN = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByPk(req.params.isbn);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookExists = await Book.findByPk(req.body.isbn);
        if (bookExists) {
      res.status(400).json({ message: 'Book already exists' });
      return;
    }

    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByPk(req.params.isbn);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    const updatedBook = await book.update(req.body);
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByPk(req.params.isbn);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    await book.destroy();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

