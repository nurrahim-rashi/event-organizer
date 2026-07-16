import { api } from "../api/axios";
import type { ResetPasswordSchema } from "../schemas/auth/reset-password";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";

interface ResetPasswordPayload extends ResetPasswordSchema {
    token: string;
}

function useResetPassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (payload: ResetPasswordPayload) => {
            await api.post(
                "/auth/reset-password",
                {password: payload.password},
                {headers: {Authorization: `Bearer ${payload.token}`}},
            );
        },
        onSuccess: () => {
            alert("Password reser successfully");
            navigate("/login");
        },
        onError: (error: AxiosError<{message: string}>) => {
            alert(error.response?.data.message || "Something went wrong");
        },
    });
};

export default useResetPassword;