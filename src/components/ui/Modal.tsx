export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md">
        {children}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-slate-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
