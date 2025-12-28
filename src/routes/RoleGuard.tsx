import { Navigate } from "react-router";
import { useAppSelector } from "../app/hooks";
import { type UserRole } from "../app/authSlice";
import type { ReactNode } from "react"

type Props = {
  children: ReactNode;
  allowedRoles: UserRole[];
};

export default function RoleGuard({ allowedRoles, children }: Props) {
  const role = useAppSelector((s) => s.auth.role);
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

