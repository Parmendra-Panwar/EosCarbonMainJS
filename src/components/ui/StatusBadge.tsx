export default function StatusBadge({ status }: { status: string }) {
  const color =
    status === "PENDING"
      ? "bg-yellow-600"
      : status.includes("VERIFIED")
      ? "bg-green-600"
      : status === "REJECTED"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <span className={`px-3 py-1 rounded text-xs ${color}`}>
      {status}
    </span>
  );
}
