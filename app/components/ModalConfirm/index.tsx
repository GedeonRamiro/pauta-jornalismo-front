"use client";

import { useState, ReactNode } from "react";
import { CiCircleAlert } from "react-icons/ci";

type Props = {
  titleModal: string;
  buttonDelete: ReactNode;
  onConfirm: () => void;
};

export default function ModalConfirm({
  titleModal,
  onConfirm,
  buttonDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block">
        {buttonDelete}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded shadow-md p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-gray-700 flex justify-center mb-2">
              <CiCircleAlert size={50} />
            </div>
            <p className="text-gray-800 mb-4 text-center">{titleModal}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Sim
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
