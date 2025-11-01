"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useRef } from "react";

import {
  FaHome,
  FaUser,
  FaCog,
  FaCar,
  FaVideo,
  FaBriefcase,
} from "react-icons/fa";
import { IoMdDocument, IoMdLogOut } from "react-icons/io";

type SidebarProps = {
  children: ReactNode;
  typeUser: number;
};

const menuItems = [
  { name: "Início", href: "/", icon: <FaHome size={20} />, roles: [1, 2, 3] },
  {
    name: "Pautas",
    href: "/pautas",
    icon: <IoMdDocument size={20} />,
    roles: [2, 3],
  },
  {
    name: "Usuários",
    href: "/users",
    icon: <FaUser size={20} />,
    roles: [2, 3],
  },
  { name: "Carros", href: "/carros", icon: <FaCar size={20} />, roles: [3] },
  {
    name: "Câmeras",
    href: "/cameras",
    icon: <FaVideo size={20} />,
    roles: [3],
  },
  {
    name: "Cargos",
    href: "/cargos",
    icon: <FaBriefcase size={20} />,
    roles: [3],
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: <FaCog size={20} />,
    roles: [1, 2, 3],
  },
  {
    name: "Sair",
    href: "/login",
    icon: <IoMdLogOut size={20} />,
    roles: [1, 2, 3],
  },
];

export default function Sidebar2({ children, typeUser }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const filtered = menuItems.filter((item) => item.roles.includes(typeUser));

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      {/* Botão para mobile */}
      <button
        onClick={toggleSidebar}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-300 rounded-lg sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Abrir menu"
      >
        {/* ícone de menu */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 text-gray-300 dark:bg-gray-800 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {filtered.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <main className="p-4 sm:ml-64 w-full">{children}</main>
    </div>
  );
}
