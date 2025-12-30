export default function Table({ columns, data, renderRow }: any) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-slate-400">
          {columns.map((c: string) => (
            <th key={c} className="text-left py-2">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => renderRow(row))}
      </tbody>
    </table>
  );
}
