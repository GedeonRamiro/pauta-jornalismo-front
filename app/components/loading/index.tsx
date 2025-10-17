export default function Loading() {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-white/70 border-t-transparent rounded-full animate-spin" />
        <span className="text-white text-sm">Carregando...</span>
      </div>
    </div>
  );
}
