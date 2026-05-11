'use client';

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import Markdown from 'react-markdown';
import { LaptopMinimalCheck } from 'lucide-react';

const planSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.enum(['computer', 'notebook']),
  purpose: z.enum(['study', 'play']),
  budget: z.number().min(0),
  stores: z.array(z.string()).min(1).max(5),
});

type SchemaPlan = z.infer<typeof planSchema>;

const options = ['Amazon', 'Mercado Livre', 'Kabum', 'Pichau', 'Terabyte'];

export function Formulario() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaPlan>({
    resolver: zodResolver(planSchema),
  });

  async function sub(data: SchemaPlan) {
    console.log(data);

    try {
      setLoading(true);
      const response = await fetch('https://nexus-backend-5fmr.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          purpose: data.purpose,
          budget: Number(data.budget),
          stores: data.stores,
        }),
      });
      const reader = response.body?.getReader();
      const decorder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          break;
        }
        setOutput((prev) => prev + decorder.decode(value));
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        setLoading(false);
      }
    } finally{
      setLoading(false)
      console.log("Encerrou a conexão!")
    }
  }

  return (
    <div className="w-full h-svh flex flex-col items-center justify-center">
      <div className="flex justify-center items-center">
        <LaptopMinimalCheck
          size="4.5rem"
          className="text-amber-400 font-bold"
        />
        <h1 className="text-7xl font-black">Nexus</h1>
      </div>
      <p className="max-w-[42ch] mt-2 text-center">
        Seu assistente virtual que te ajuda a tomar a decisão correta na compra
        do seu computador ou notebook.
      </p>
      <form
        onSubmit={handleSubmit(sub)}
        className="mt-8 text-center flex flex-col gap-2 max-w-96"
      >
        <Input
          className="shadow-neutral-400 shadow-sm"
          required
          placeholder="Digite seu nome:"
          {...register('name')}
        />
        <Input
          className="shadow-neutral-400 shadow-sm"
          required
          type="number"
          placeholder="Digite o valor que irá investir:"
          {...register('budget', { valueAsNumber: true })}
        />

        <select
          required
          className="outline-1 rounded-lg shadow-neutral-400 shadow-sm"
          {...register('purpose')}
        >
          <option value="" selected disabled>
            Escolha a finalidade
          </option>
          <option value="study">Estudar</option>
          <option value="play">Jogar</option>
        </select>

        <select
          required
          className="outline-1 rounded-lg shadow-neutral-400 shadow-sm"
          {...register('type')}
        >
          <option value="" selected disabled>
            Escolha o tipo de dispositivo
          </option>

          <option value="computer">Computador</option>
          <option value="notebook">Notebook</option>
        </select>

        <p>Escolha as lojas de sua preferência:</p>
        {options.map((store) => (
          <label key={store} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={store}
              {...register('stores')} // O RHF agrupa automaticamente valores com o mesmo nome em um array
            />
            {store}
          </label>
        ))}

        <Button
          disabled={loading ? true : false}
          type="submit"
          variant="link"
          className="bg-amber-400 px-12 py-6 text-2xl rounded-2xl"
        >
          {loading ? 'Carregando' : 'Enviar'}
        </Button>
        {errors.budget && (
          <span className="text-red-500 text-sm">{errors.budget.message}</span>
        )}
      </form>
      <article className="prose prose-zinc prose-xl max-w-[800px] h-[600px] overflow-y-auto mt-12 lg:px-none px-12 mb-12">
        <Markdown>{output}</Markdown>
      </article>
    </div>
  );
}
