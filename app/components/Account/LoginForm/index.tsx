"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";

export default function LoginForm() {
  const schema = z.object({
    email: z.string().email("Digite um email válido!"),
    password: z.string().min(6, "No mínimo 6 caracteres!"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [buttonLoading, setButtonLoading] = useState(false);

  async function handleSubmitLogin(data: FormData) {
    setButtonLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Email ou senha incorretos!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Erro inesperado ao fazer login:", error);
    }
    setButtonLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitLogin)}
      className="w-full max-w-sm mx-auto"
    >
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
      {buttonLoading ? (
        <button
          type="submit"
          className="flex justify-center items-center cursor-pointer text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center transition"
          disabled
        >
          <CgSpinner className="size-5 mr-2 animate-spin" />
          Carregando...
        </button>
      ) : (
        <button
          type="submit"
          className="cursor-pointer text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center transition"
        >
          Entrar
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <p className="text-sm text-gray-700">Não tem conta?</p>
        <Link href="/register">
          <button
            type="button"
            className="cursor-pointer py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
          >
            Criar conta
          </button>
        </Link>
      </div>
    </form>
  );
}
