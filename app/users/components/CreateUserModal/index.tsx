"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";
import UserForm from "../UserForm";

export default function CreateUserModal({ token }: { token: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Cadastrar Usuário"
      buttonModal={
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium rounded text-sm px-4 py-2 cursor-pointer"
          >
            Novo Usuário
          </button>
        </div>
      }
      openModal={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <UserForm token={token} onClose={() => setIsOpen(false)} />
    </Modal>
  );
}
