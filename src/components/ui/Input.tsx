import type { InputHTMLAttributes } from "react";

type Props = {
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-slate-400">{label}</label>}
      <input
        {...props}
        className="w-full bg-slate-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
