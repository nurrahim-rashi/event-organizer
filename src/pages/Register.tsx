import { useState } from "react"
import { api } from "../api/axios"
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {z} from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters")
});

function Register () {
    const [show, setShow] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const navigate = useNavigate();

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsPending(true);
        try {
            await api.post("/auth/register", {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            alert("Register success");
            navigate("/")
        } catch (error) {
            console.log(error);
            alert("Something went wrong")
        } finally {
            setIsPending(false);
        }
    }
    
    return (
        <div>
            <div>
                <h1>Register</h1>

                <form action="" onSubmit={form.handleSubmit(onSubmit)}>

                    {/*INPUT NAME*/}
                    <div>
                        <label>Name</label>
                        <input type="text" {...form.register("name")} />
                        {form.formState.errors.name && (
                            <p>{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    {/*INPUT EMAIL*/}
                    <div>
                        <label>Email</label>
                        <input type="text" {...form.register("email")} />
                        {form.formState.errors.email && (
                            <p>{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    {/*INPUT PASSWORD*/}
                    <div>
                        <label>Password</label>
                        <div>
                            <input type={show ? "text" : "password"} {...form.register("password")} />
                            <button type="button" onClick={() => setShow(!show)}>{show? "Hide" : "Show"}</button>
                        </div>
                        {form.formState.errors.password && (
                            <p>{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    {/*TOMBOL SUBMIT*/}
                    <button
                    type="submit"
                    disabled={isPending}>{isPending? "Loading..." : "Register"}</button>
                </form>

            </div>
        </div>
    )
};

export default Register