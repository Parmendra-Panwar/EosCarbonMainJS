type Props = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  ...props
}: Props) {
  const styles = {
    primary: "bg-primary hover:bg-teal-700",
    secondary: "border border-slate-600 hover:bg-slate-800",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      className={`px-4 py-2 rounded font-medium transition disabled:opacity-50 ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
