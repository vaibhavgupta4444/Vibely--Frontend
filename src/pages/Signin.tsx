"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const formSchema = z.object({
    email: z.string().email("Please enter valid email address"),
    password: z.string().min(6, "At least 6 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[\W_]/, "Must contain a special character")
})

const Signin = () => {

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password:""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`${backend}/v1/user/signin`, {
                email: values.email,
                password: values.password
            });

            if (response.data.success) {
      
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                
                // Show success message
                toast.success('Login successful! Redirecting...');

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 403) {
                toast.error('Invalid email or password');
            } else if (error.request) {
                toast.error('Cannot connect to server. Please try again.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
        } finally {
            
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-10/12 md:w-1/2 md:h-1/2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="joe@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="........." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default Signin