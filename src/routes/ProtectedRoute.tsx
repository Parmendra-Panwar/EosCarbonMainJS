import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
}