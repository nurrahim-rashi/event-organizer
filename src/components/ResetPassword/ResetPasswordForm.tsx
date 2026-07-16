import PasswordInput from "../Auth/PasswordInput";
import type { ResetPasswordSchema } from "../../schemas/auth/reset-password";
import type { Control } from "react-hook-form";

interface ResetPasswordFormProps {
  control: Control<ResetPasswordSchema>;
  isPending: boolean;
  onSubmit: () => void;
}

function ResetPasswordForm({
  control,
  isPending,
  onSubmit,
}: ResetPasswordFormProps) {
  return (
    <form
      id="form-reset-password"
      className="mt-7 space-y-5"
      onSubmit={onSubmit}
    >
      <PasswordInput<ResetPasswordSchema>
        control={control}
        name="password"
        label="New Password"
        id="form-reset-password-password"
      />

      <PasswordInput<ResetPasswordSchema>
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        id="form-reset-password-confirm"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#A855F7] py-3 font-semibold text-white transition-all duration-200 hover:bg-[#9333EA] hover:shadow-lg hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default ResetPasswordForm;