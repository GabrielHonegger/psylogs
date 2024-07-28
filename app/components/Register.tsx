'use client';

import React from 'react'
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
    email: z.string().email({
        message: "Insira um email válido",
    }),
    password: z.string().min(10),
});

export default function Register() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
          },
    });

    const handleSubmit = async () => {
        //const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(form.getValues())
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    }

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

                <Button className="w-full mt-3">Criar Conta</Button>
            </form>
            <FormDescription className="mt-3">Já possui uma conta? Entrar</FormDescription>
        </Form>
      </CardContent>
    </Card>
  )
}