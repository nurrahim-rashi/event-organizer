import AuthBrand from "../components/Auth/AuthBrand";
import AuthCard from "../components/Auth/AuthCard";
import BackLink from "../components/Auth/BackLink";
import ForgotPasswordForm from "../components/ForgotPassword/ForgotPasswordForm";
import useForgotPassword from "../hooks/auth/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../schemas/auth/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

function ForgotPassword() {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: forgotPasswordAction, isPending } = useForgotPassword();

  async function onSubmit(data: ForgotPasswordSchema) {
    await forgotPasswordAction(data);
  }

  return (
    <div className="min-h-screen bg-[#0A0514] flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AuthBrand />

          <AuthCard
            title="Forgot Password"
            subtitle="Enter your email to receive a password reset link."
          >
            <ForgotPasswordForm
              control={form.control}
              isPending={isPending}
              onSubmit={form.handleSubmit(onSubmit)}
            />

            <p className="mt-7 text-center text-sm text-gray-400">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#22D3EE] transition-colors hover:text-[#67E8F9]"
              >
                Sign In
              </Link>
            </p>
          </AuthCard>

          <div className="mt-6">
            <BackLink />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
