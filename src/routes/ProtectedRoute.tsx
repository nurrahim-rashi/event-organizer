import { Link } from "react-router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Link to="/login" replace />;
  }

  return <>{children}</>;
}
