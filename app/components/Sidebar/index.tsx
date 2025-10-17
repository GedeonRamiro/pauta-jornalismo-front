"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaUser,
  FaCog,
  FaCar,
  FaVideo,
  FaBriefcase,
} from "react-icons/fa";
import { IoMdMenu, IoMdDocument, IoMdLogOut } from "react-icons/io";

type SidebarProps = {
  children: ReactNode;
  typeUser: number;
  userName?: string;
};

const menuItems = [
  {
    name: "Início",
    href: "/",
    icon: <FaHome size={20} />,
    roles: [1, 2, 3],
  },
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

export default function Sidebar({ children, typeUser }: SidebarProps) {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(typeUser)
  );

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsOpen(!isMobileView);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
       bg-gray-900 text-white flex flex-col
        ${isOpen ? "w-56" : "w-16"}
        transition-all duration-300
        fixed top-0 left-0 h-screen z-50
        overflow-y-auto
     `}
      >
        {/* Logo/Header (toggle no mobile) */}
        <div
          className="flex items-center h-16 px-4 border-b border-gray-700 cursor-pointer"
          onClick={() => isMobile && setIsOpen((prev) => !prev)}
        >
          <span className="text-xl text-gray-400">
            <IoMdMenu />
          </span>
          {isOpen && <span className="ml-2 text-lg font-semibold">Painel</span>}
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-4 px-4 py-3 mx-2 rounded-lg
                  transition-colors
                  ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }
                `}
              >
                <span>{item.icon}</span>
                <span className={`${isOpen ? "inline" : "hidden"} text-sm`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={`
        flex-1
        ${isOpen ? "ml-56" : "ml-16"}
        transition-all duration-300 p-6
        `}
      >
        {children}
      </main>
    </div>
  );
}
