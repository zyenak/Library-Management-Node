import React, { createContext, useState, useEffect, FC, ReactNode } from "react";
import { useSnackbar } from "./snackbar-context";
import { useErrorBoundary } from "react-error-boundary";
import { useApi } from "../hooks/useApi";

export interface Book {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface BooksContextType {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addBook: (newBook: Book) => void;
  updateBook: (updatedBook: Book) => void;
  deleteBook: (isbn: string) => void;
}

export const BooksContext = createContext<BooksContextType>({
  books: [],
  setBooks: () => {},
  addBook: () => {},
  updateBook: () => {},
  deleteBook: () => {},
});

export const BooksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { showMessage } = useSnackbar();
  const { showBoundary } = useErrorBoundary();
  const [books, setBooks] = useState<Book[]>([]);
  const { fetchData, saveData, deleteData } = useApi();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await fetchData("/books");
        setBooks(data);
      } catch (error) {
        // Error handling is already done in fetchData
      }
    };

    fetchBooks();
  }, []);

  const addBook = async (newBook: Book) => {
    try {
      const data = await saveData({
        method: "POST",
        url: "/books",
        payload: newBook,
      });
      setBooks((prevBooks) => [...prevBooks, data]);
      showMessage("New Book Added Successfully");
    } catch (error) {
      console.error("Failed to add book", error);
    }
  };

  const updateBook = async (updatedBook: Book) => {
    try {
      await saveData({
        method: "PUT",
        url: `/books/${updatedBook.isbn}`,
        payload: updatedBook,
      });
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.isbn === updatedBook.isbn ? updatedBook : book))
      );
      showMessage("Book Updated Successfully");
    } catch (error) {
      console.error("Failed to update book", error);
    }
  };

  const deleteBook = async (isbn: string) => {
    try {
      await deleteData(`/books/${isbn}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.isbn !== isbn));
      showMessage("Book Deleted Successfully");
    } catch (error) {
      console.error("Failed to delete book", error);
      showMessage("Book Deletion Unsuccessful");
    }
  };

  const contextValue: BooksContextType = {
    books,
    setBooks,
    addBook,
    updateBook,
    deleteBook,
  };

  return <BooksContext.Provider value={contextValue}>{children}</BooksContext.Provider>;
};
