import { axiosInstance } from "../../api/axios";
import type { ResetPasswordSchema } from "../../schemas/auth/reset-password";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

interface ResetPasswordPayload extends ResetPasswordSchema {
  token: string;
}

function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      await axiosInstance.post(
        "/auth/reset-password",
        { password: payload.password },
        { headers: { Authorization: `Bearer ${payload.token}` } },
      );
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Something went wrong");
    },
  });
}

export default useResetPassword;
