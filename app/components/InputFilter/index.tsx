"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function InputFilter() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = searchParams.get("filter");
    if (current) setSearch(current);
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateFilter(search);
  }

  function updateFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim() === "") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center max-w-sm mx-auto"
    >
      <div className="relative w-full">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 block w-full ps-10 p-2.5"
          placeholder="Buscar..."
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-gray-700 rounded border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300"
      >
        <FaSearch size={16} />
      </button>
    </form>
  );
}
