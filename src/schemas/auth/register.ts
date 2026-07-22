import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid emil format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`';]/,
      "Password must contain at least one special character",
    ),
  role: z.enum(["USER", "ADMIN"], {message: "Please select a valid role"}),
  referredByCode: z.string().optional().or(z.literal("")).transform((val) => (val ? val.trim().toUpperCase() : undefined)),
});

export type RegisterSchema = z.infer<typeof registerSchema>;