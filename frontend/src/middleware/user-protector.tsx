import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/user-context";

interface WithUserOnlyProtectorProps {
  children: React.ReactNode;
}

const WithUserOnlyProtector: React.FC<WithUserOnlyProtectorProps> = ({ children }) => {
  const { user, isAdmin } = useUser();

  if (user && !isAdmin) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default WithUserOnlyProtector;
