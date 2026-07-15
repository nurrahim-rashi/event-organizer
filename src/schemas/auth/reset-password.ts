import z from "zod";

export const resetPasswordSchema = z
.object({
    password: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
        /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`';]/,
        "Password must contain at least one special character",
    ),
    confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;