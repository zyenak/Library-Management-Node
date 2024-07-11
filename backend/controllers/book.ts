import { Request, Response } from 'express';
import * as bookModel from '../models/book';
import { Book } from '../models/book';
import _ from 'lodash';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books: Book[] = await bookModel.getAllBooks();
    console.log('Books:', books);
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookByISBN = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await bookModel.getBookByISBN(req.params.isbn);
    if (book) {
      res.json(_.omit(book, ['isbn']));
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
    const newBook: Book = { ...req.body };
    const success = await bookModel.addBook(newBook);
    if (success) {
      res.status(201).json(newBook);
    } else {
      res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedBook: Partial<Book> = { ...req.body };
    const success = await bookModel.updateBook(req.params.isbn, updatedBook);
    if (success) {
      res.json({ message: 'Book updated' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await bookModel.deleteBook(req.params.isbn);
    if (success) {
      res.json({ message: 'Book deleted' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
