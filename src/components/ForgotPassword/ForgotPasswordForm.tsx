import type { ForgotPasswordSchema } from "../../schemas/auth/forgot-password";
import { Controller, type Control } from "react-hook-form";

interface ForgotPasswordFormProps {
    control: Control<ForgotPasswordSchema>;
    isPending: boolean;
    onSubmit: () => void;
};

function ForgotPasswordForm({
    control,
    isPending,
    onSubmit,
}: ForgotPasswordFormProps) {
    return (
        <form
        id="form-forgot-password"
        className="mt-7 space-y-5"
        onSubmit={onSubmit}>
           <Controller
           name="email"
           control={control}
           render={({field, fieldState}) => (
            <div className="flex flex-col gap-2">
                <label 
                htmlFor="form-forgot-password-email"
                className="text-sm font-semibold text-white"
                >
                    Email
                </label>

                <input 
                    {...field}
                    id="form-forgot-password-email"
                    type="email"
                    placeholder="you@domain.com"
                    autoComplete="on"
                    aria-invalid={fieldState.invalid}
                    className={`w-full rounded-xl border bg-[#151026] px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-all
                        ${
                            fieldState.invalid
                                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                                : "border-[#2B2140] focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/30"
                        }`} 
                />

                {fieldState.error && (
                    <p className="text-sm text-red-400">
                        {fieldState.error.message}
                    </p>
                )}
            </div>
           )} 
           />

           <button
           type="submit"
           disabled={isPending}
           className="w-full rounded-xl bg-[#A855F7] py-3 font-semibold text-white transition-all duration-200 hover:bg-[#9333EA] hover:shadow-lg hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
           >
            {isPending ? "Sending..." : "Send Reset Link"}
           </button>
        </form>
    );
}

export default ForgotPasswordForm;