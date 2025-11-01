"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";
import CameraForm from "../CameraForm";

export default function CreateCameraModal({ token }: { token: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Cadastrar Câmera"
      buttonModal={
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)} //
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium rounded text-sm px-4 py-2 cursor-pointer"
          >
            Nova Câmera
          </button>
        </div>
      }
      openModal={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <CameraForm token={token} onClose={() => setIsOpen(false)} />
    </Modal>
  );
}
