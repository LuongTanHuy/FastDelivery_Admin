import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo } from "../api/account";
const ProtectedRoute = ({ children, roles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await getUserInfo();
        if (user && roles.some((r) => user.role.includes(r))) {
          setIsAllowed(true);
        } else {
          localStorage.clear();
          setIsAllowed(false);
        }
      } catch (err) {
        localStorage.clear();
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [roles]);

  if (loading) return null;

  return isAllowed ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
