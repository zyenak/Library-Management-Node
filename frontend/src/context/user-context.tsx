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
  const { books, setBooks, fetchBooks } = useContext<BooksContextType>(BooksContext);
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
  
      // Fetch borrowed books for the logged-in user
      const borrowedBooksData = await fetchData(`/users/${data.id}/borrowed-books`);
  
      // Update state with received user data including borrowedBooks
      setUser({
        id: data.id,
        username: data.username,
        role: data.role,
        borrowedBooks: borrowedBooksData || [],
      });
  
      setBorrowedBooks(borrowedBooksData || []);
  
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify({
        id: data.id,
        username: data.username,
        role: data.role,
        borrowedBooks: borrowedBooksData || [],
      }));
  
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

  const borrowBook = async (isbn: string) => {
    try {
      const response = await saveData({
        method: "POST",
        url: `/users/${user?.id}/borrow/${isbn}`,
      });
  
        const borrowedBooksData = await fetchData(`/users/${user?.id}/borrowed-books`);
  
        // Update state with received user data including borrowedBooks
        const updatedUser = { ...user!, borrowedBooks: borrowedBooksData || [] };
        setUser(updatedUser);
        setBorrowedBooks(updatedUser.borrowedBooks);
        showMessage("Book borrowed successfully");
        fetchBooks();
     
    } catch (error) {

      console.error("Error in borrwoing book:" ,error)
      showMessage("Failed to borrow book");
    }
  };
  

  const returnBook = async (isbn: string) => {
    try {
      const response = await saveData({
        method: "POST",
        url: `/users/${user?.id}/return/${isbn}`,
      });

        const updatedBorrowedBooks = user!.borrowedBooks.filter((book) => book.isbn !== isbn);
        const updatedUser = { ...user!, borrowedBooks: updatedBorrowedBooks };
        setUser(updatedUser);
        setBorrowedBooks(updatedBorrowedBooks);
        showMessage("Book returned successfully");
        fetchBooks();
      
    } catch (error) {
      showMessage("Failed to return book");
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

  const deleteUser = async (id: string) => {
    try {
      await deleteData(`/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
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
