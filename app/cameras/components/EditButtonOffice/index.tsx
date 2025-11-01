"use client";

import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import Modal from "@/app/components/Modal";
import { ICamera } from "@/app/types/types";
import CameraForm from "../CameraForm";

type Props = {
  camera: ICamera;
  token: string;
};

export default function EditButtonCamera({ camera, token }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Editar Câmera"
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
      <CameraForm
        token={token}
        camera={camera}
        onClose={() => setIsOpen(false)}
      />
    </Modal>
  );
}
