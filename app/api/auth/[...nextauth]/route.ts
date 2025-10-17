import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais obrigatórias.");
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const data = response.data;

          if (!data?.accessToken || !data?.user) {
            console.error("Formato de resposta inesperado:", data);
            return null;
          }

          console.log("Usuário autenticado:", data.user);

          return {
            ...data.user,
            accessToken: data.accessToken,
          };
        } catch (error: any) {
          console.error(
            "Erro ao autenticar:",
            error.response?.data || error.message
          );
          return null;
        }
      },
    }),
  ],

  pages: { signIn: "/login" },
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user = token.user as User;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, signOut };
