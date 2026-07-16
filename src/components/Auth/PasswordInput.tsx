import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

interface PasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  id: string;
  placeholder?: string;
  showForgotLink?: boolean;
}

function PasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  id,
  placeholder = "••••••••",
  showForgotLink = false,
}: PasswordInputProps<T>) {
  const [show, setShow] = useState(false);

  const { field, fieldState } = useController({
    control,
    name,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Label + Forgot Password */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-white"
        >
          {label}
        </label>

        {showForgotLink && (
          <Link
            to="/forgot-password"
            className="text-xs text-[#22D3EE] hover:text-[#67E8F9] transition-colors"
          >
            Forgot password?
          </Link>
        )}
      </div>

      {/* Password Input */}
      <div className="relative">
        <input
          {...field}
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
          className={`w-full rounded-xl bg-[#151026] border px-4 py-3 pr-12 text-white placeholder:text-gray-500 outline-none transition-all
          ${
            fieldState.invalid
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
              : "border-[#2B2140] focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/30"
          }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {show ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {fieldState.error && (
        <p className="text-sm text-red-400">
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;