'use client';

import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import Markdown from 'react-markdown';
import { BookA, FolderOpen, LaptopMinimalCheck, Loader } from 'lucide-react';

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
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaPlan>({
    resolver: zodResolver(planSchema),
  });

  const containerRef = useRef<HTMLDivElement>(null);

  //Para ir descendo o container juntamente com a resposta
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  async function sub(data: SchemaPlan) {
    console.log(data);

    try {
      setOutput(' ');
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
    } finally {
      setLoading(false);
      console.log('Encerrou a conexão!');
    }
  }

  return output ? (
    <div className="max-w-[800px] max-h-[600px] shadow-sm px-4 rounded-2xl py-8 flex flex-col bg-[#fff] items-center justify-center">
      <div className="flex justify-center items-center gap-4">
        <FolderOpen size="64px" className=" text-amber-400" />
        <h1 className="text-3xl lg:text-6xl text-amber-400 font-bold">
          Resultado
        </h1>
      </div>
      <article
        ref={containerRef}
        className="prose prose-zinc prose-2xl max-w-[800px] h-[600px] bg-[#fff] overflow-y-auto mt-12 text-2xl px-12 mb-12"
      >
        {loading ? (
          <div className="flex items-center gap-4">
            <Loader size="2.5rem" className="animate-spin text-amber-400" />
            Gerando recomendação...
          </div>
        ) : (
          <></>
        )}
        <Markdown>{output}</Markdown>
      </article>
      <Button
        disabled={loading}
        onClick={() => setOutput(null)}
        variant="link"
        className="bg-amber-400 px-12 py-6 text-2xl rounded-2xl"
      >
        Gerar outra recomendação
      </Button>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center shadow-sm max-w-[800px] xl:w-[800px] h-[600px] rounded-2xl py-8 bg-[#fff]">
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
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
        <Input
          className="shadow-neutral-400 shadow-sm"
          required
          type="number"
          placeholder="Digite o valor que irá investir:"
          {...register('budget', { valueAsNumber: true })}
        />
        {errors.budget && (
          <span className="text-red-500 text-sm">{errors.budget.message}</span>
        )}

        <select
          required
          defaultValue=""
          className="outline-1 rounded-lg shadow-neutral-400 shadow-sm"
          {...register('purpose')}
        >
          <option value="" disabled>
            Escolha a finalidade
          </option>
          <option value="study">Estudar</option>
          <option value="play">Jogar</option>
        </select>

        <select
          required
          defaultValue=""
          className="outline-1 rounded-lg shadow-neutral-400 shadow-sm"
          {...register('type')}
        >
          <option value="" disabled>
            Escolha o tipo de dispositivo
          </option>
          <option value="computer">Computador</option>
          <option value="notebook">Notebook</option>
        </select>

        <p>Escolha as lojas de sua preferência:</p>
        {options.map((store) => (
          <label key={store} className="flex items-center gap-2">
            <input type="checkbox" value={store} {...register('stores')} />
            {store}
          </label>
        ))}
        {errors.stores && (
          <span className="text-red-500 text-sm">{errors.stores.message}</span>
        )}

        <Button
          disabled={loading}
          type="submit"
          variant="link"
          className="bg-amber-400 px-12 py-6 text-2xl rounded-2xl"
        >
          {loading ? 'Carregando' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
}
