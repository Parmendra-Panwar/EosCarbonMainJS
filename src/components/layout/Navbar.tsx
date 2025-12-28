import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../app/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();

  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6">
      <h1 className="font-semibold">Carbon Credit Platform</h1>
      <button
        onClick={() => dispatch(logout())}
        className="text-sm text-red-400 hover:text-red-300"
      >
        Logout
      </button>
    </header>
  );
}
