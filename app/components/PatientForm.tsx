'use client';

import React from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription }  from "@/components/ui/form"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"


const nucleos = [
  {
    id: "mae",
    label: "Mãe",
  },
  {
    id: "pai",
    label: "Pai",
  },
  {
    id: "irmaos",
    label: "Irmãos",
  },
  {
    id: "filhos",
    label: "Filhos",
  },
  {
    id: "avos",
    label: "Avós",
  },
]

const formSchema = z.object({
  nome: z.string().min(1, {
    message: "Nome precisa ter mais de 1 caracter.",
  }),
  idade: z.number({
    required_error: "A idade é obrigatória",
    invalid_type_error: "Idade inválida"
  }).positive({
    message: "A idade precisa ser um número positivo."
  }).min(1).max(120),
  sexo: z.enum(["M", "F"], {
    required_error: "Escolha uma opção",
    message: "Escolha uma opção",
  }),
  nucleos: z.number({
    message: "Você precisa escolher pelo menos um núcleo familiar.",
    required_error: "Você precisa escolher pelo menos um núcleo familiar.",
    invalid_type_error: "Opção Inválida"
  }),
  religiao: z.enum(["C", "I", "H", 
  "B", "J", "E", "T", "A", "O"], {
    required_error: "Escolha uma opção",
  }),
  escolaridade: z.enum(["INFANTIL", "EF1", "EF2", 
  "MEDIO", "TECNICO", "SUPERIOR_INCOMPLETO", 
  "SUPERIOR_COMPLETO", "POS_GRADUACAO", "POS_DOUTORADO", "N/A"], {
    required_error: "Escolha uma opção",
  }),
  trabalho: z.string().min(1, {
    message: "Insira a ocupação principal do paciente.",
  }),
})

export default function IdentificationDataForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      idade: "",
      sexo: "N",
      nucleos: 0,
      trabalho: "",
      escolaridade: "N/A"
    },
  });

  const handleSubmit = () => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log(JSON.stringify(form.getValues()))
    fetch('/api/create-patient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(form.getValues())
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with POST request:', error);
    })
  }
  return (
    <div className="lg:w-1/3 w-11/12 m-auto flex flex-col gap-6">
      <h1 className="text-center text-2xl lg:text-3xl font-semibold">Novo Paciente</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">

          {/* Nome */}
          <FormField control={form.control} name="nome" render={({field}) => {
            return <FormItem>
              <FormLabel htmlFor="nome">Nome (Apelido ou iniciais)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ju" id="nome" type="username" {...field}/>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          }} />

          {/* Idade */}
          <FormField control={form.control} name="idade" render={({field}) => {
            return <FormItem>
              <FormLabel htmlFor="idade">Idade</FormLabel>
              <FormControl>
                <Input className="w-32" id="idade" placeholder="Ex: 38" type="number" {...field}
                value={field.value || ''} // Ensure value is a string (React expects this)
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}/>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          }} />

           {/* Sexo Biológico */}
           <FormField control={form.control} name="sexo" render={({field}) => {
            return <FormItem>
              <FormLabel htmlFor="sexo">Sexo Biológico</FormLabel>
              <FormControl>
                <RadioGroup className="flex justify-between w-60" onValueChange={field.onChange} {...field}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="M" id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="F" id="feminino" />
                    <Label htmlFor="feminino">Feminino</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          }} />

          {/* Núcleo Familiar
          <FormField control={form.control} name="nucleos" render={({field}) => {
            return (
              <FormItem>
              <div className="mb-4">
                <FormLabel htmlFor="nucleos" className="text-base">Núcleo Familiar</FormLabel>
                <FormDescription>
                  Selecione o(s) núcleo(s) familiar(es) do paciente.
                </FormDescription>
              </div>
              {nucleos.map((nucleo) => (
                <FormField
                  key={nucleo.id}
                  control={form.control}
                  name="nucleos"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={nucleo.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(nucleo.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, nucleo.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== nucleo.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel htmlFor={`${nucleo.id}`} className="font-normal">
                          {nucleo.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
            )
          }} />  */}

          {/* Religião */}
          <FormField control={form.control} name="religiao" render={({field}) => {
            return <FormItem>
              <FormLabel htmlFor="religiao">Religião</FormLabel>
              <FormControl>
                <RadioGroup id="religiao" className="grid grid-cols-2	gap-2" onValueChange={field.onChange} {...field}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="C" id="cristianismo" />
                    <Label htmlFor="cristianismo">Cristianismo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="I" id="islamismo" />
                    <Label htmlFor="islamismo">Islamismo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="H" id="hinduismo" />
                    <Label htmlFor="hinduismo">Hinduísmo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="B" id="budismo" />
                    <Label htmlFor="budismo">Budismo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="J" id="judaismo" />
                    <Label htmlFor="judaismo">Judaísmo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="E" id="espiritismo" />
                    <Label htmlFor="espiritismo">Espiritismo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="T" id="taoismo" />
                    <Label htmlFor="taoismo">Taoísmo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="A" id="ateismo" />
                    <Label htmlFor="ateismo">Ateísmo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="O" id="outra" />
                    <Label htmlFor="outra">Outra</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          }} />

          {/* Escolaridade */}
          <FormField control={form.control} name="escolaridade" render={({field}) => {
            return <FormItem>
              <FormLabel htmlFor="escolaridade">Escolaridade</FormLabel>
              <FormControl>
              <Select id={field.name} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nível de escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nível de escolaridade</SelectLabel>
                    <SelectItem value="INFANTIL">Educação Infantil (Pré-escola)</SelectItem>
                    <SelectItem value="EF1">Ensino Fundamental I</SelectItem>
                    <SelectItem value="EF2">Ensino Fundamental II</SelectItem>
                    <SelectItem value="MEDIO">Ensino Médio</SelectItem>
                    <SelectItem value="TECNICO">Ensino Técnico e Profissionalizante</SelectItem>
                    <SelectItem value="SUPERIOR_INCOMPLETO">Ensino Superior Incompleto</SelectItem>
                    <SelectItem value="SUPERIOR_COMPLETO">Ensino Superior Completo</SelectItem>
                    <SelectItem value="POS_GRADUACAO">Pós-Graduação</SelectItem>
                    <SelectItem value="POS_DOUTORADO">Pós-Doutorado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          }} />

          {/* Atividade Laborial */}
          <FormField control={form.control} name="trabalho" render={({field}) => {
            return <FormItem>
              <FormLabel htmlFor="trabalho">Atividade Laboral</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Arquiteto" id="trabalho" type="text" {...field}/>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          }} />

          {/* Sumbmit Button */}
          <Button type="submit" className="m-auto text-center mt-8 flex w-full">
            Salvar
          </Button>
        </form>
      </Form>
    </div>
  )
}
