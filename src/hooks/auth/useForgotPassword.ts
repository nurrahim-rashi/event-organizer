import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { axiosInstance } from "../../api/axios";
import toast from "react-hot-toast";
import type { ForgotPasswordSchema } from "../../schemas/auth/forgot-password";

function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordSchema) => {
      await axiosInstance.post("/auth/forgot-password", {
        email: payload.email,
      });
    },
    onSuccess: () => {
      toast.success("Check your email for reset link");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Something went wrong");
    },
  });
}

export default useForgotPassword;
