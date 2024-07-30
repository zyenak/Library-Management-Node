import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useApi } from "../hooks/useApi";
import { useSnackbar } from "../context/snackbar-context";
import classes from "./styles.module.css";

const ChangePasswordPage: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { saveData } = useApi();
    const { showMessage } = useSnackbar();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = await saveData({
                method: "PATCH",
                url: "/users/change-password",
                payload: { currentPassword, newPassword, confirmPassword },
            });
            showMessage(data.message);
        } catch (error: any) {
            showMessage(error.message || "Failed to change password");
        }
    };

    return (
        <div className={`${classes.pageHeader} ${classes.mb2}`}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h4">Change Password</Typography>
                <TextField
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Change Password
                </Button>
            </Box>
        </div>
    );
};

export default ChangePasswordPage;
