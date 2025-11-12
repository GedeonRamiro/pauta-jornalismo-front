"use client";

import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import Modal from "@/app/components/Modal";
import { IVehicle } from "@/app/types/types";
import VehicleForm from "../VehicleForm";

type Props = {
  vehicle: IVehicle;
  token: string;
};

export default function EditButtonVehicle({ vehicle, token }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Editar Veículo"
      buttonModal={
        <button
          onClick={() => setIsOpen(true)}
          title="Editar"
          className="text-gray-900 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <FiEdit size={18} />
        </button>
      }
      openModal={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <VehicleForm
        token={token}
        vehicle={vehicle}
        onClose={() => setIsOpen(false)}
      />
    </Modal>
  );
}
