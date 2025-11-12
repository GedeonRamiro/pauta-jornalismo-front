"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";
import { IUser } from "@/app/types/types";
import UserForm from "../UserForm";
import { MdEdit } from "react-icons/md";

type Props = {
  user: IUser;
  token: string;
};

export default function EditButtonUser({ user, token }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      titleModal="Editar Usuário"
      buttonModal={
        <button
          className="bg-gray-700 hover:bg-gray-700 p-2 rounded transition cursor-pointer"
          onClick={() => setIsOpen(true)}
          title="Editar"
        >
          <MdEdit />
        </button>
      }
      openModal={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <UserForm token={token} user={user} onClose={() => setIsOpen(false)} />
    </Modal>
  );
}
