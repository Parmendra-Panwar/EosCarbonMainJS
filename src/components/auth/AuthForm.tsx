import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { loginSuccess, type UserRole } from "../../features/auth/authSlice";

const roleFields: Record<UserRole, string> = {
  farmer: "Land Details",
  company: "Company Name",
  ngo: "NGO Registration ID",
  government: "Department Name",
};

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const dispatch = useAppDispatch();
  const [role, setRole] = useState<UserRole>("farmer");
  const [extra, setExtra] = useState("");

  const submit = () => {
    dispatch(
      loginSuccess({
        userId: crypto.randomUUID(),
        role,
        token: "mock-jwt-token",
        isAuthenticated: true,
      })
    );
  };

  return (
    <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-6 capitalize">{mode}</h2>

      <select
        className="w-full mb-4 bg-slate-800 p-3 rounded"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
      >
        <option value="government">Government</option>
        <option value="ngo">NGO</option>
        <option value="farmer">Farmer</option>
        <option value="company">Company</option>
      </select>

      <input
        className="w-full mb-4 bg-slate-800 p-3 rounded"
        placeholder={roleFields[role]}
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-primary py-3 rounded hover:bg-teal-700"
      >
        {mode === "login" ? "Login" : "Signup"}
      </button>
    </div>
  );
}
