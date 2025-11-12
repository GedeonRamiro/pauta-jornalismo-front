"use client";

import dynamic from "next/dynamic";

// ⚡ Import dinâmico para evitar erro no SSR
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

interface Props {
  content: string;
}

export default function MarkdownView({ content }: Props) {
  return (
    <div className="prose max-w-none text-gray-800" data-color-mode="light">
      <MarkdownPreview source={content} />
    </div>
  );
}
