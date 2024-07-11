import React, { useState, forwardRef, KeyboardEvent, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import { useApi } from "../../hooks/useApi";
import { useSnackbar } from "../../context/snackbar-context";

interface ChangePasswordDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
}

const Transition = forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  handleClose,
  handleSubmit,
}) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [currentPasswordError, setCurrentPasswordError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const { saveData } = useApi();
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordError("");
      setNewPasswordError("");
      setConfirmPasswordError("");
      setIsFormValid(false);
    }
  }, [open]);



  const validateForm = () => {
    console.log(currentPasswordError, newPassword, currentPassword)
    if (currentPassword && !currentPasswordError && newPassword && confirmPassword === newPassword) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
  };

  const validateCurrentPassword = async () => {
    try {
      const data = await saveData({
        method: "POST",
        url: "/users/validate-password",
        payload: { currentPassword },
      });
      if (data.message === "Current password is correct") {
        setCurrentPasswordError("");
        
      } else {
        setCurrentPasswordError("Current password does not match");
      }
    } catch (error: any) {
      setCurrentPasswordError("Please enter correct password");
    }
    validateForm();
   
  };

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("New password and confirm password must match");
    } else {
      setConfirmPasswordError("");
    }

    validateForm();
  };

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (isFormValid) {
      handleSubmit(currentPassword, newPassword, confirmPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showMessage("Please provide correct input before submitting");
    }
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      onSubmit(event as any);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      onKeyDown={handleEnterKeyDown}
    >
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="currentPassword"
          label="Current Password"
          type="password"
          fullWidth
          variant="standard"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          onBlur={validateCurrentPassword}
          helperText={currentPasswordError}
          error={!!currentPasswordError}
        />
        <TextField
          margin="dense"
          id="newPassword"
          label="New Password"
          type="password"
          fullWidth
          variant="standard"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          fullWidth
          variant="standard"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={validatePasswords}
          helperText={confirmPasswordError}
          error={!!confirmPasswordError}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" onClick={onSubmit} disabled={!isFormValid}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
