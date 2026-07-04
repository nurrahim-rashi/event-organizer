import { Navigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getEvent } from "../services/event.service";

interface OwnerProtectedRouteProps {
  children: React.ReactNode;
}

export default function OwnerProtectedRoute({
  children,
}: OwnerProtectedRouteProps) {
  const { id } = useParams<{ id: string }>();
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  // Simulasi mengambil data user yang sedang login dari localStorage/Context
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const verifyOwnership = async () => {
      if (!id || !currentUser) {
        setIsOwner(false);
        return;
      }
      try {
        const event = await getEvent(Number(id));
        if (event.organizerId === currentUser.id) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch {
        setIsOwner(false);
      }
    };
    verifyOwnership();
  }, [id, currentUser]);

  if (isOwner === null) {
    return (
      <div className="text-center text-on-surface p-10">
        Verifying access...
      </div>
    );
  }

  if (!currentUser || !isOwner) {
    // Tendang ke home atau page un-authorized jika bukan pemilik
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
