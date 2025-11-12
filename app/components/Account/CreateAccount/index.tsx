"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "../../loading";

export default function CreateAccountForm() {
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const schema = z.object({
    name: z.string().min(3, "No mínimo 3 caracteres!"),
    email: z.string().email("Digite um email válido!"),
    password: z.string().min(6, "No mínimo 6 caracteres!"),
    cpf: z.string().length(14, "Digite um CPF válido!"),
    phone: z.string().length(15, "Digite um telefone válido!"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function formatCPF(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = value;
  }

  function formatPhone(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, ""); // remove tudo que não for número
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // adiciona parênteses
    value = value.replace(/(\d{5})(\d{4})$/, "$1-$2"); // adiciona traço
    e.target.value = value;
  }

  async function handleSubmitCreateAccount(data: FormData) {
    setLoading(true);
    // Remove caracteres não numéricos antes de enviar ao backend
    const cleanedData = {
      ...data,
      cpf: data.cpf.replace(/\D/g, ""), // Ex: "12345678900"
      phone: data.phone.replace(/\D/g, ""), // Ex: "86900000000"
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/user`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Erro ao criar usuário!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
        return;
      }

      toast.success(`Usuário ${result.name} criado com sucesso!`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });

      reset();
      route.replace("/login");
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error.message || error);
      toast.error("Erro ao salvar usuário", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitCreateAccount)}
      className="w-full max-w-sm mx-auto"
    >
      {loading && <Loading />}
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Nome
        </label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-700 focus:border-gray-700 block w-full p-2.5"
          placeholder="Seu nome..."
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Email
        </label>
        <input
          type="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-700 focus:border-gray-700 block w-full p-2.5"
          placeholder="email@gmail.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="cpf"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          CPF
        </label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-700 focus:border-gray-700 block w-full p-2.5"
          placeholder="000.000.000-00"
          maxLength={14}
          {...register("cpf", { onChange: formatCPF })}
        />
        {errors.cpf && (
          <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="telefone"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          placeholder="(00) 00000-0000"
          maxLength={15}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-700 focus:border-gray-700 block w-full p-2.5"
          {...register("phone", { onChange: formatPhone })}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Senha
        </label>
        <input
          type="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-700 focus:border-gray-700 block w-full p-2.5"
          placeholder="********"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center transition"
      >
        Salvar
      </button>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <p className="text-sm text-gray-700">Já tem conta?</p>
        <Link href="/login">
          <button
            type="button"
            className="cursor-pointer py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
          >
            Login
          </button>
        </Link>
      </div>
    </form>
  );
}
