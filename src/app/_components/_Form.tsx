"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const planSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório"),
  type: z.enum(['computer', 'notebook'], {message: "Selecionte o tipo de dispositivo."}),
  purpose: z.enum(['study', 'play'], {message: "selecione a finalidade da sua compra."}), 
  budget: z.number().min(0),
  stores: z.array(z.string()).min(1).max(5),
});

type PlanSchemaForm = z.infer<typeof planSchema>;

type PlanProps = {
  onSubmit: (data: PlanSchemaForm) => void
}

export function PlanForm({ onSubmit }: PlanProps) {

      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<PlanSchemaForm>({
        resolver: zodResolver(planSchema),
      });
    
      return (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Field>
            <FieldLabel>Nome</FieldLabel>
    
            <Input
              placeholder="Digite seu nome"
              {...register("name")}
            />
    
            <FieldDescription>
              Nome do plano ou usuário.
            </FieldDescription>
    
            <FieldError
              errors={errors.name ? [errors.name] : []}
            />
          </Field>
    
          <Field>
            <FieldLabel>Tipo</FieldLabel>
    
            <select
              className="border rounded-md h-10 px-3 w-full"
              {...register("type")}
            >
              <option value="">Selecione</option>
              <option value="computer">Computador</option>
              <option value="notebook">Notebook</option>
            </select>
    
            <FieldError
              errors={errors.type ? [errors.type] : []}
            />
          </Field>
    
          <Field>
            <FieldLabel>Finalidade</FieldLabel>
    
            <select
              className="border rounded-md h-10 px-3 w-full"
              {...register("purpose")}
            >
              <option value="">Selecione</option>
              <option value="study">Estudo</option>
              <option value="play">Jogos</option>
            </select>
    
            <FieldError
              errors={errors.purpose ? [errors.purpose] : []}
            />
          </Field>
    
          <Field>
            <FieldLabel>Valor disponível</FieldLabel>
    
            <Input
              type="number"
              placeholder="5000"
              {...register("budget")}
            />
    
            <FieldError
              errors={errors.budget ? [errors.budget] : []}
            />
          </Field>
    
          <Field>
            <FieldLabel>Lojas</FieldLabel>
    
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="kabum"
                  {...register("stores")}
                />
                Kabum
              </label>
    
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="pichau"
                  {...register("stores")}
                />
                Pichau
              </label>
    
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="terabyte"
                  {...register("stores")}
                />
                Terabyte
              </label>
            </div>
    
            <FieldError
              errors={errors.stores ? [errors.stores] : []}
            />
          </Field>
    
          <Button type="submit">
            Enviar
          </Button>
        </form>
  )
}