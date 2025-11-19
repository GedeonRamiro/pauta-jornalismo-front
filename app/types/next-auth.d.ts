import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    typeUser?: number;
    accessToken?: string;
  }

  interface Session extends DefaultSession {
    accessToken?: string;
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      cpf?: string;
    };
  }
}
