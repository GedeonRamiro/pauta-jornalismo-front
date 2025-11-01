"use client";

import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  titleModal?: string;
  buttonModal?: ReactNode;
  openModal: boolean;
  onClose: () => void;
};

export default function Modal({
  children,
  titleModal,
  buttonModal,
  openModal,
  onClose,
}: Props) {
  return (
    <>
      {buttonModal}

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/40"
          onClick={onClose}
        >
          <div
            className="relative bg-white rounded shadow-md w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {titleModal}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {children}
          </div>
        </div>
      )}
    </>
  );
}
