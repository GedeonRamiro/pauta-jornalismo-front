"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";
import VehicleForm from "../VehicleForm";

export default function CreateVehicleModal({ token }: { token: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Cadastrar Veículo"
      buttonModal={
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium rounded text-sm px-4 py-2 cursor-pointer"
          >
            Novo Veículo
          </button>
        </div>
      }
      openModal={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <VehicleForm token={token} onClose={() => setIsOpen(false)} />
    </Modal>
  );
}
