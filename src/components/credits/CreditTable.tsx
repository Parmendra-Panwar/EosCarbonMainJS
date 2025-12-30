import StatusBadge from "../ui/StatusBadge";

export default function CreditTable({ credits, actions }: any) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-slate-400">
          <th>ID</th>
          <th>Qty</th>
          <th>Status</th>
          <th>Price</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {credits.map((c: any) => (
          <tr key={c.id} className="border-t border-slate-800">
            <td>{c.id.slice(0, 6)}</td>
            <td>{c.quantity}</td>
            <td><StatusBadge status={c.status} /></td>
            <td>{c.price ?? "-"}</td>
            <td>{actions?.(c)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
