import { Link, useParams } from "react-router";
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
    return <Link to="/" replace />;
  }

  return <>{children}</>;
}
