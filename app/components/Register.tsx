'use client';

import React from 'react'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription }  from "@/components/ui/form"

const formSchema = z.object({
    first_name: z.string().min(2, {
        message: "Nome precisa ter pelo menos 2 caracteres",
    }),
    email: z.string().email({
        message: "Insira um email válido",
    }),
    password1: z.string().min(12, {
        message: "Senha precisa ter pelo menos 12 caracteres",
    }),
    password2: z.string().min(12, {
        message: "Senha precisa ter pelo menos 12 caracteres",
    }),
})
.refine((data) => data.password1 === data.password2, {
    message: "As senhas são diferentes",
    path: ["password2"] // Set the error location to password2 field
});

type RegisterData = z.infer<typeof formSchema>

export default function Register() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            email: "",
            password1: "",
            password2: "",
          },
    });

    const [csrfToken, setCsrfToken] = useState('');
    const [JWToken, setJWToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/csrf-token/', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    setCsrfToken(data.csrfToken);
                } else {
                    console.error('Failed to fetch CSRF token:', data);
                }
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, [])

    const handleSubmit = async (data: RegisterData) => {
        const { email, password1, password2 } = data; // To exclude the first_name

        const submissionData = {
            username: email,
            email: email,
            password1: password1,
            password2: password2
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/registration/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
            console.log(result.access);
            setJWToken(result.access);
            
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    };

    useEffect(() => {
        if (JWToken) {
            console.log("Token is set, now updating first name...");
            handleFirstName(data);
        }
    }, [JWToken]);

    const handleFirstName = async (data: RegisterData) => {
        console.log(data.first_name);
        console.log(JWToken);

        if (!JWToken) {
            console.error("JWT Token is not set. Cannot proceed with PATCH request.");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/user/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWToken}`,
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ first_name: data.first_name })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    };

  return (
    <Card className="w-full max-w-sm m-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          Insira seu melhor email e crie uma senha forte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form className="grid gap-4" noValidate onSubmit={form.handleSubmit(handleSubmit)}>

                {/* Name */}
                <FormField control={form.control} className="grid gap-2" name="first_name" render={({field}) => {
                    return <FormItem>
                        <FormLabel htmlFor="first_name">Nome</FormLabel>
                        <FormControl>
                            <Input id="first_name" type="text" placeholder="Ex: Julia" {...field}/>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                }} />

                {/* Email */}
                <FormField control={form.control} className="grid gap-2" name="email" render={({field}) => {
                    return <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                            <Input id="email" type="email" placeholder="m@exemplo.com" {...field}/>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                }} />

                {/* Password1 */}
                <FormField control={form.control} className="grid gap-2" name="password1" render={({field}) => {
                    return <FormItem>
                        <FormLabel htmlFor="password1">Senha</FormLabel>
                        <FormControl>
                            <Input id="password1" type="password" {...field}/>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                }} />

                {/* Password2 */}
                <FormField control={form.control} className="grid gap-2" name="password2" render={({field}) => {
                    return <FormItem>
                        <FormLabel htmlFor="password2">Confirme a Senha</FormLabel>
                        <FormControl>
                            <Input id="password2" type="password" {...field}/>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                }} />

                <Button className="w-full mt-3">Criar Conta</Button>
            </form>
            <FormDescription className="mt-3">Já possui uma conta? <Link href="http://localhost:3000/login" className='text-slate-800 hover:underline'>Entrar</Link></FormDescription>
        </Form>
      </CardContent>
    </Card>
  )
}