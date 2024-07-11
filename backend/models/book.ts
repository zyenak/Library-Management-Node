import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(__dirname, '../data/books.json');

export interface Book {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const readJSONFile = async (): Promise<Book[]> => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books.json:', error);
    return [];
  }
};

const writeJSONFile = async (data: Book[]): Promise<void> => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing books.json:', error);
  }
};

export const getAllBooks = async (): Promise<Book[]> => {
  return await readJSONFile();
};

export const getBookByISBN = async (isbn: string): Promise<Book | undefined> => {
  const books = await readJSONFile();
  return books.find(book => book.isbn === isbn);
};

export const addBook = async (book: Book): Promise<boolean> => {
  const books = await readJSONFile();
  const existingBook = books.find(b => b.isbn === book.isbn);
  if (existingBook) {
    return false;
  }
  books.push(book);
  await writeJSONFile(books);
  return true;
};

export const updateBook = async (isbn: string, updatedBook: Partial<Book>): Promise<boolean> => {
  const books = await readJSONFile();
  const index = books.findIndex(book => book.isbn === isbn);
  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    await writeJSONFile(books);
    return true;
  }
  return false;
};

export const deleteBook = async (isbn: string): Promise<boolean> => {
  let books = await readJSONFile();
  const filteredBooks = books.filter(book => book.isbn !== isbn);
  if (filteredBooks.length !== books.length) {
    await writeJSONFile(filteredBooks);
    return true;
  }
  return false;
};
