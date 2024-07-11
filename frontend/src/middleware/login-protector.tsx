import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/user-context";
import { Snackbar } from "@mui/material";

export const WithLoginProtector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    useEffect(() => {
        if (!user) {
            setSnackbarOpen(true);
        }
    }, [user]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            {user ? (
                <>{children}</>
            ) : (
                <Navigate to="/" replace />
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Please login to proceed!"
            />
        </>
    );
};
