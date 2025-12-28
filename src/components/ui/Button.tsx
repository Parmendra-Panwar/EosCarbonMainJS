type Props = {
  label: string;
  variant?: "primary" | "secondary";
};

export default function Button({ label, variant = "primary" }: Props) {
  const base =
    "px-6 py-3 rounded-lg font-medium transition focus:outline-none";
  const styles =
    variant === "primary"
      ? "bg-primary hover:bg-teal-700"
      : "border border-slate-600 hover:bg-slate-800";

  return <button className={`${base} ${styles}`}>{label}</button>;
}
