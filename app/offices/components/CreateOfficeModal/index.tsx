"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";
import OfficeForm from "../FormOffice";

export default function CreateOfficeModal({ token }: { token: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Cadastrar Cargo"
      buttonModal={
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)} //
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium rounded text-sm px-4 py-2 cursor-pointer"
          >
            Novo Cargo
          </button>
        </div>
      }
      openModal={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <OfficeForm token={token} onClose={() => setIsOpen(false)} />
    </Modal>
  );
}
