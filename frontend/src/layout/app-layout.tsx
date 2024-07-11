import React, { useState } from "react";
import { useUser } from "../context/user-context";
import { Outlet } from 'react-router-dom';
import { LoginDialog } from "../components/login/login-dialog";
import AppHeader from "../components/header/header";

const AppLayout: React.FC = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const { loginUser } = useUser();


  const handleLoginSubmit = (username: string, password: string) => {
    loginUser(username, password);
    setOpenLoginDialog(false);

  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
  };
  

return (
    <>
      <AppHeader onLoginClick={() => setOpenLoginDialog(true)} />
      <Outlet/>
      <LoginDialog
        open={openLoginDialog}
        handleSubmit={handleLoginSubmit}
        handleClose={handleLoginClose}
      />
    </>
  );

};

export default AppLayout;