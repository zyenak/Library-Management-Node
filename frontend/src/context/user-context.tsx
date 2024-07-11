import React, { createContext, useState, useEffect, useContext } from "react";
import { BooksContextType, Book, BooksContext } from "./books-context";
import { useSnackbar } from "./snackbar-context";
import { useApi } from "../hooks/useApi";

export interface User {
  id: string;
  username: string;
  role: string;
  borrowedBooks: Book[];
}

interface UserContextType {
  user: User | null;
  users: User[];
  isAdmin: boolean;
  loginUser: (username: string, password: string) => void;
  logoutUser: () => void;
  borrowBook: (isbn: string) => void;
  returnBook: (isbn: string) => void;
  addUser: (newUser: User) => void;
  deleteUser: (username: string) => void;
  borrowedBooks: Book[];
  setBorrowedBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  getAllUsers: () => void; // Function to fetch all users
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const { books, setBooks } = useContext<BooksContextType>(BooksContext);
  const { showMessage } = useSnackbar();
  const { fetchData, saveData, deleteData } = useApi();

  useEffect(() => {
    console.log(user)
    setIsAdmin(user?.role === "admin");
  }, [user]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUser(storedUser);
      setBorrowedBooks(storedUser.borrowedBooks || []);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      getAllUsers(); // Fetch all users if the logged-in user is admin
    }
  }, [isAdmin]);

  const loginUser = async (username: string, password: string) => {
    try {
      const data = await saveData({
        method: "POST",
        url: "/auth/login",
        payload: { username, password },
      });

      localStorage.setItem("token", data.token);

      showMessage("Logged in successfully");

      console.log
      // Use data.id, data.username, data.role to set user information
      setUser({ id: data.id, username: data.username, role: data.role, borrowedBooks: data.borrowedBooks || [] });
      setBorrowedBooks(data.borrowedBooks || []);
      localStorage.setItem("user", JSON.stringify({ id: data.id, username: data.username, role: data.role, borrowedBooks: data.borrowedBooks }));

    } catch (error) {
      showMessage("Failed to login");
    }
  };

  const logoutUser = () => {
    setUser(null);
    setBorrowedBooks([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    showMessage("Logged out successfully");
  };

  const borrowBook = (isbn: string) => {
    const bookToBorrow = books.find((book: Book) => book.isbn === isbn);
    if (bookToBorrow && bookToBorrow.quantity > 0) {
      const updatedBook = { ...bookToBorrow, quantity: bookToBorrow.quantity - 1 };
      setBooks((prevBooks: Book[]) =>
        prevBooks.map((book: Book) =>
          book.isbn === isbn ? updatedBook : book
        )
      );

      setUser((prevUser: User | null) => {
        const updatedBorrowedBooks = [...(prevUser?.borrowedBooks || []), bookToBorrow];
        setBorrowedBooks(updatedBorrowedBooks);

        const updatedUser = { ...prevUser!, borrowedBooks: updatedBorrowedBooks };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });
      showMessage("Book borrowed successfully");
    } else {
      showMessage("Book not available for borrowing");
    }
  };

  const returnBook = (isbn: string) => {
    const indexToRemove = borrowedBooks.findIndex((book) => book.isbn === isbn);
    if (indexToRemove !== -1) {
      setBooks((prevBooks: Book[]) =>
        prevBooks.map((book: Book) =>
          book.isbn === isbn
            ? { ...book, quantity: book.quantity + 1 }
            : book
        )
      );

      const updatedBorrowedBooks = [...borrowedBooks];
      updatedBorrowedBooks.splice(indexToRemove, 1);
      setBorrowedBooks(updatedBorrowedBooks);

      setUser((prevUser: User | null) => {
        const updatedUser = { ...prevUser!, borrowedBooks: updatedBorrowedBooks };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });

      showMessage("Book returned successfully");
    } else {
      showMessage("Book not found in borrowed list");
    }
  };

  const addUser = async (newUser: User) => {
    try {
      await saveData({
        method: "POST",
        url: "/auth/register",
        payload: newUser,
      });

      showMessage("User added successfully");
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } catch (error) {
      showMessage("Failed to add user");
    }
  };

  const deleteUser = async (username: string) => {
    try {
      await deleteData(`/users/${username}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
      showMessage("User deleted successfully");
    } catch (error) {
      showMessage("Failed to delete user");
    }
  };

  const getAllUsers = async () => {
    try {
      const fetchedUsers = await fetchData("/users");

      // Set borrowedBooks as empty array for each user
      const usersWithBorrowedBooks = fetchedUsers.map((u: User) => ({
        ...u,
        borrowedBooks: [],
      }));

      setUsers(usersWithBorrowedBooks);
    } catch (error) {
      showMessage("Failed to fetch users");
    }
  };

  const contextValue: UserContextType = {
    user,
    users,
    isAdmin,
    loginUser,
    logoutUser,
    borrowBook,
    returnBook,
    addUser,
    deleteUser,
    borrowedBooks,
    setBorrowedBooks,
    getAllUsers,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
