import Image from "next/image";

export default function Start(accountProps: { accountProps: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center md:bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row md:shadow-lg w-full max-w-7xl rounded-lg overflow-hidden bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Image
            src="/assets/imagens/logo.png"
            alt="Logo"
            width={300}
            height={200}
            className="mb-6 w-auto h-auto"
            priority
          />
          {accountProps.accountProps}
        </div>

        <div className="flex-1 bg-gray-800 p-8 flex flex-col justify-center text-center md:text-left">
          <h2 className="text-white font-poppins text-2xl md:text-3xl font-semibold mb-4">
            Pauta-Jornalismo
          </h2>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed">
            Bem-vindo ao nosso sistema de organização de pauta. Aqui, cada
            história começa com uma boa estrutura: definição da pauta,
            distribuição das equipes e escolha dos recursos necessários para a
            cobertura. A plataforma ajuda repórteres, editores, produtores e
            cinegrafistas a coordenarem suas atividades de forma clara e
            eficiente.
          </p>
        </div>
      </div>
    </div>
  );
}
