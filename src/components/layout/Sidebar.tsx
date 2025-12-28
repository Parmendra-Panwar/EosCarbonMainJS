import { NavLink } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { sidebarConfig } from "./sidebarConfig";

export default function Sidebar() {
  const role = useAppSelector((s) => s.auth.role);

  if (!role) return null;

  return (
    <aside className="w-64 border-r border-slate-800 p-4">
      <nav className="space-y-2">
        {sidebarConfig[role].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive
                  ? "bg-primary"
                  : "hover:bg-slate-800 text-slate-300"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
