"use client";

import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import Modal from "@/app/components/Modal";
import OfficeForm from "../FormOffice";
import { IOffice } from "@/app/types/types";

type Props = {
  office: IOffice;
  token: string;
};

export default function EditButton({ office, token }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Editar Cargo"
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
      <OfficeForm
        token={token}
        office={office}
        onClose={() => setIsOpen(false)}
      />
    </Modal>
  );
}
