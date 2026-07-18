import { useState } from "react";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "../schemas/auth/register";

function Register() {
  const [show, setShow] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      referredByCode: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data: RegisterSchema) {
    setIsPending(true);
    try {
      await axiosInstance.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        referredByCode: data.referredByCode,
      });

      alert("Register success");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-[#A855F7] p-6 shadow-md text-white flex flex-col gap-2 items-center">
        <h1 className="font-bold">Register</h1>

        <form
          className="flex flex-col gap-2.5"
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/*INPUT NAME*/}
          <div className="flex flex-col gap-2 justify-center">
            <label className="font-semibold">Name</label>
            <input
              className="bg-white text-black focus:outline-[#22D3EE] p-2 rounded-lg"
              type="text"
              placeholder="Insert your name here..."
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/*INPUT EMAIL*/}
          <div className="flex flex-col gap-2 justify-center">
            <label className="font-semibold">Email</label>
            <input
              className="bg-white text-black focus:outline-[#22D3EE] p-2 rounded-lg"
              type="text"
              placeholder="Insert your email here..."
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/*PILIH ROLE*/}
          <div className="flex flex-col gap-2 justify-center">
            <label className="font-semibold" htmlFor="">
              Role
            </label>
            <select
              className="bg-white text-black focus:outline-[#22D3EE] p-2 rounded-lg"
              {...form.register("role")}
            >
              <option value="USER">Customer</option>
              <option value="ADMIN">Event Organizer</option>
            </select>
            {form.formState.errors.role && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {/*INPUT PASSWORD*/}
          <div className="flex flex-col gap-2 justify-center">
            <label className="font-semibold">Password</label>
            <div className="flex flex-row gap-2 items-center">
              <input
                className="bg-white text-black focus:outline-[#22D3EE] p-2 rounded-lg"
                placeholder="Insert your password"
                type={show ? "text" : "password"}
                {...form.register("password")}
              />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/*INPUR REFERRAL CODE*/}
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm font-medium text-gray-200">
              Referral Code{" "}
              <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., REF-XXXXXX"
              {...form.register("referredByCode")}
              className="p-3 bg-[#161224] border border-purple-900/40 rounded-xl text-white outline-none focus:border-purple-600 transition-all uppercase placeholder:normal-case"
            />
            {/* Menampilkan pesan error dari Zod jika ada */}
            {form.formState.errors.referredByCode && (
              <p className="text-xs text-red-500 mt-1">
                {form.formState.errors.referredByCode.message}
              </p>
            )}
          </div>

          {/*TOMBOL SUBMIT*/}
          <button
            className="bg-[#2C0051] p-2 rounded-lg hover:bg-[#6900B3] hover:cursor-pointer"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
