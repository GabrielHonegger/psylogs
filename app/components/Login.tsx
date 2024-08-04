'use client';

import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
    username: z.string().min(2, {
        message: "Nome precisa ter pelo menos 2 caracteres",
    }),
    email: z.string().email({
        message: "Insira um email válido",
    }),
    password: z.string().min(12, {
        message: "Senha inválida"
    }),
});

type LoginData = z.infer<typeof formSchema>

export default function Login() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
          },
    });

    const [csrfToken, setCsrfToken] = useState('');

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

    const handleSubmit = async (data: LoginData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    }

  return (
    <Card className="w-full max-w-sm m-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>
          Digite seu email e senha de usuário.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form className="grid gap-4" noValidate onSubmit={form.handleSubmit(handleSubmit)}>
                {/* Name */}
                <FormField control={form.control} className="grid gap-2" name="username" render={({field}) => {
                    return <FormItem>
                        <FormLabel htmlFor="username">Nome</FormLabel>
                        <FormControl>
                            <Input id="username" type="text" placeholder="Ex: Julia" {...field}/>
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

                {/* Password */}
                <FormField control={form.control} className="grid gap-2" name="password" render={({field}) => {
                    return <FormItem>
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <FormControl>
                            <Input id="password" type="password" {...field}/>
                        </FormControl>
                        <FormMessage></FormMessage>
                    </FormItem>
                }} />

                <Button className="w-full mt-3">Entrar</Button>
            </form>
            <FormDescription className="mt-3">Ainda não possui uma conta? <Link href="http://localhost:3000/register" className='text-slate-800 hover:underline'>Criar Conta</Link></FormDescription>
        </Form>
      </CardContent>
    </Card>
  )
}