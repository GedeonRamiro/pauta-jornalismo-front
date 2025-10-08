import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // Nosso tipo de usuário personalizado
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    accessToken?: string;
  }

  // Tipagem da sessão (retornada por useSession)
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
