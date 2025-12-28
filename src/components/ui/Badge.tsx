export default function Badge({ text, color }: any) {
  return (
    <span className={`px-2 py-1 text-xs rounded ${color}`}>
      {text}
    </span>
  );
}
