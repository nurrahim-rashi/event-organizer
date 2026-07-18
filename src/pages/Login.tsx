import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {userAuth} from "../stores/useAuth"
import { api } from "../api/axios";
import { Link } from "react-router";
import { loginSchema, type LoginSchema } from "../schemas/auth/login";

function Login () {
    const [show, setShow] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {login} = userAuth()
    const navigate = useNavigate()

    async function onSubmit(data: LoginSchema) {
        setIsPending(true);
        try {
            const response = await api.post("/auth/login", {
                email: data.email,
                password: data.password,
            });

            console.log("Struktur respons API:", response.data);

            alert("login success");

            login({
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                profilePic: response.data.user.profilePic,
                role: response.data.user.role,
                accessToken: response.data.accessToken,
            });

            navigate("/");
        } catch (error) {
            console.log(error);
            alert("Login failed");
        } finally {
            setIsPending(false);
        }
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-[#A855F7] p-6 shadow-md text-white flex flex-col gap-2 items-center">
                <div className="flex flex-col gap-0.5 items-center">
                    <h1 className="text-xl font-bold">Login</h1>
                    <p className="text-lg">Please login to your account</p>
                </div>

                <form className="flex flex-col gap-2.5" onSubmit={form.handleSubmit(onSubmit)}>
                    {/*INPUT EMAIL */}
                    <div className="flex flex-col gap-2 justify-center">
                        <label htmlFor="" className="font-semibold">Email</label>
                        <input className="bg-white text-black focus:outline-[#22D3EE] p-2 rounded-lg" type="email" {...form.register("email")} placeholder="example@mail.com" />
                        {form.formState.errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    {/*INPUT PASSWORD */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="" className="font-semibold">Password</label>
                        <div className="flex flex-row gap-1.5">
                            <input className="bg-white text-black focus:outline-[#22D3EE] p-2 rounded-lg" type={show? "text" : "password"} {...form.register("password")} placeholder="Pasword here..." />
                            <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>

                    {/*TOMBOL SUBMIT */}
                    <button className="bg-[#2C0051] p-2 rounded-lg hover:bg-[#6900B3] hover:cursor-pointer" type="submit" disabled={isPending}>{isPending ? "Loading..." : "Login"}</button>
                </form>

                <div>
                    <Link to="/register" className="text-xs underline">Don't have an account? sign-up here</Link>
                </div>
            </div>
        </div>
    )
};

export default Login;