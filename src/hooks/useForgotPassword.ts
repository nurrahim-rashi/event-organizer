import {useMutation} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "../api/axios";
import type { ForgotPasswordSchema } from "../schemas/auth/forgot-password";

function useForgotPassword() {
    return useMutation({
        mutationFn: async (payload: ForgotPasswordSchema) => {
            await api.post("/auth/forgot-password", {
                email: payload.email,
            });
        },
        onSuccess: () => {
            alert("Check your email for reset link")
        },
        onError: (error: AxiosError<{message: string}>) => {
            alert(error.response?.data.message || "Something went wrong")
        },
    });
};

export default useForgotPassword