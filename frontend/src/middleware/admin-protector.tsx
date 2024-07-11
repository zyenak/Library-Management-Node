import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/user-context";

interface WithAdminProtectorProps {
  children: React.ReactNode;
}

const WithAdminProtector: React.FC<WithAdminProtectorProps> = ({ children }) => {
  const { isAdmin } = useUser();

  if (isAdmin) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default WithAdminProtector;
