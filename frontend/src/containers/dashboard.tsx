import React, { useContext, useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "../context/user-context";
import { BooksContext } from "../context/books-context";
import CustomTable from "../components/custom-table/custom-table";
import classes from "./styles.module.css";

const Dashboard: React.FC = () => {
  const { isAdmin, user, borrowBook, returnBook, borrowedBooks, users, deleteUser } = useUser();
  const { books, setBooks, deleteBook } = useContext(BooksContext);
  const [activeBookIsbn, setActiveBookIsbn] = useState<string | null>(null);

  useEffect(() => {
  }, [borrowedBooks]);

  const handleBookBorrow = (book: any) => {
    setActiveBookIsbn(book.isbn);
    borrowBook(book.isbn);
  };

  const handleBookReturn = (book: any) => {
    setActiveBookIsbn(null);
    returnBook(book.isbn);
  };

  const handleDeleteBook = (isbn: string) => {
    deleteBook(isbn);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  const bookColumns = [
    { header: "Name", render: (book: any) => book.name },
    { header: "ISBN", render: (book: any) => book.isbn },
    { header: "Category", render: (book: any) => book.category },
    { header: "Quantity", render: (book: any) => book.quantity },
    { header: "Price", render: (book: any) => `$${book.price}` },
    {
      header: "Actions",
      render: (book: any) => (
        <div className={classes.actionsContainer}>
          {!isAdmin && user && book.quantity > 0 && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleBookBorrow(book)}
            >
              Borrow
            </Button>
          )}
          {isAdmin && (
            <>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                size="small"
                to={`/admin/books/${book.isbn}/edit`}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleDeleteBook(book.isbn)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const userColumns = [
    { header: "Name", render: (user: any) => user.username },
    { header: "Role", render: (user: any) => (user.role === "admin" ? "Admin" : "User") },
    {
      header: "Issued Books",
      render: (user: any) =>
        user.borrowedBooks && user.borrowedBooks.length > 0 ? (
          <div>
            {user.borrowedBooks.map((book: any) => (
              <span key={book.isbn}>
                {book.name} ({book.isbn}),{" "}
              </span>
            ))}
          </div>
        ) : (
          "No books issued"
        ),
    },
    {
      header: "Actions",
      render: (user: any) => (
        <div className={classes.actionsContainer}>
          {isAdmin && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleDeleteUser(user.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  const borrowedBookColumns = [
    { header: "Name", render: (book: any) => book.name },
    { header: "ISBN", render: (book: any) => book.isbn },
    { header: "Category", render: (book: any) => book.category },
    { header: "Price", render: (book: any) => `$${book.price}` },
    {
      header: "Actions",
      render: (book: any) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleBookReturn(book)}
        >
          Return
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className={`${classes.pageHeader} ${classes.mb2}`}>
        <Typography variant="h5">Dashboard</Typography>
        <div className={classes.adminOptions}>
          {isAdmin && (
            <>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/admin/users/add"
              >
                Add User
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/admin/books/add"
              >
                Add Book
              </Button>
            </>
          )}
        </div>
      </div>

      <CustomTable
        rows={books}
        columns={bookColumns}
      />

      {user && !isAdmin && (
        <>
          <div className={`${classes.pageHeader} ${classes.mb2}`}>
            <Typography variant="h5">Borrowed Books</Typography>
          </div>
          {borrowedBooks.length > 0 ? (
            <CustomTable
              rows={borrowedBooks}
              columns={borrowedBookColumns}

            />
          ) : (
            <Typography variant="h5">No books issued!</Typography>
          )}
        </>
      )}

      {isAdmin && (
        <>
          <div className={`${classes.pageHeader} ${classes.mb2}`}>
            <Typography variant="h5">Users List</Typography>
          </div>
          <CustomTable
            rows={users}
            columns={userColumns}
          />
        </>
      )}
    </>
  );
};

export default Dashboard;
