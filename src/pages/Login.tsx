import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useNavigate } from "react-router";
import {userAuth} from "../stores/useAuth"
import { api } from "../api/axios";

const formSchema = z.object({
    email: z.email(),
    password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters")
})

function Login () {
    const [show, setShow] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {login} = userAuth()
    const navigate = useNavigate()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsPending(true);
        try {
            const response = await api.post("/auth/login", {
                email: data.email,
                password: data.password,
            });

            alert("login success");

            login({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                profilePic: response.data.profilePic,
                role: response.data.role,
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
        <div>
            <div>
                <div>
                    <h1>Login</h1>
                    <p>Please login to your account</p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/*INPUT EMAIL */}
                    <div>
                        <label htmlFor="">Email</label>
                        <input type="email" {...form.register("email")} placeholder="example@mail.com" />
                        {form.formState.errors.email && (
                            <p>
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    {/*INPUT PASSWORD */}
                    <div>
                        <label htmlFor="">Password</label>
                        <div>
                            <input type={show? "text" : "password"} {...form.register("password")} placeholder="Pasword here..." />
                            <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
                        </div>
                        {form.formState.errors.password && (
                            <p>
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    {/*TOMBOL SUBMIT */}
                    <button type="submit" disabled={isPending}>{isPending ? "Loading..." : "Login"}</button>
                </form>
            </div>
        </div>
    )
};

export default Login;