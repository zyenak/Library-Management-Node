import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import AppLayout from "./layout/app-layout";
import { UserProvider } from "./context/user-context";
import { BooksProvider } from "./context/books-context";
import Dashboard from "./containers/dashboard";
import WithAdminProtector from "./middleware/admin-protector";
import { WithLoginProtector } from "./middleware/login-protector";
import BookFormContainer from "./containers/add-book";
import UserFormContainer from "./containers/user-list";
import EditBookFormContainer from "./containers/edit-book";
import { SnackbarProvider } from "./context/snackbar-context";
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBombFallback } from './components/fallbacks/error';

const publicRoutes = [
  { path: "/", element: <Dashboard /> },
];

const privateRoutes = [
  {
    path: "admin",
    element: (
      <WithLoginProtector>
        <WithAdminProtector>
          <Outlet />
        </WithAdminProtector>
      </WithLoginProtector>
    ),
    children: [
      { path: "books/add", element: <BookFormContainer /> },
      { path: "users/add", element: <UserFormContainer /> },
      { path: "books/:bookIsbn/edit", element: <EditBookFormContainer /> },
    ],
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      ...publicRoutes,
      ...privateRoutes,
    ],
  },
]);

const App: React.FC = () => {
  return (
    <div className="App">
      <ErrorBoundary
            FallbackComponent={ErrorBombFallback}
        >
      <SnackbarProvider>
        <BooksProvider>
          <UserProvider>
            <Suspense fallback={null}>
              <Container className="page-container">
                <RouterProvider router={router} />
              </Container>
            </Suspense>
          </UserProvider>
        </BooksProvider>
      </SnackbarProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
