export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  profilePic?: string | null;
  role: Role;
  referralCode: string;
  createdAt: string;
}
