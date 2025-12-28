import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { type UserRole } from "../../features/auth/authSlice";
import {loginSuccess } from "../../features/auth/authSlice"
import { useLoginMutation, useSignupMutation } from "../../services/authApi";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();

  const [role, setRole] = useState<UserRole>("farmer");
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const validate = () => {
    if (!form.mobile || form.mobile.length !== 10)
      return "Mobile number must be 10 digits";

    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters";

    if (isSignup) {
      if (!["farmer", "company"].includes(role))
        return "Signup allowed only for Farmer or Company";

      if (!form.name) return "Name is required";

      if (role === "farmer") {
        if (!form.aadhaar || form.aadhaar.length !== 12)
          return "Invalid Aadhaar number";
        if (!form.landArea) return "Land area is required";
      }

      if (role === "company" && !form.companyName)
        return "Company name is required";
    }

    return "";
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const payload = { ...form, role };

      const result =
        mode === "login"
          ? await login(payload).unwrap()
          : await signup(payload).unwrap();

      dispatch(loginSuccess(result));
    } catch (err: any) {
      setError(err?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md space-y-4">
      <h2 className="text-2xl font-semibold capitalize">{mode}</h2>

      {error && (
        <p className="bg-red-500/20 text-red-400 p-2 rounded">{error}</p>
      )}

      {/* Role */}
      <select
        className="w-full bg-slate-800 p-3 rounded"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        disabled={isSignup && (role === "ngo" || role === "government")}
      >
        <option value="farmer">Farmer</option>
        <option value="company">Company</option>
        {!isSignup && <option value="ngo">NGO</option>}
        {!isSignup && <option value="government">Government</option>}
      </select>

      {/* Common */}
      {isSignup && (
        <input
          className="w-full bg-slate-800 p-3 rounded"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      )}

      <input
        className="w-full bg-slate-800 p-3 rounded"
        placeholder="Mobile Number"
        maxLength={10}
        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
      />

      <input
        type="password"
        className="w-full bg-slate-800 p-3 rounded"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* Farmer */}
      {isSignup && role === "farmer" && (
        <>
          <input
            className="w-full bg-slate-800 p-3 rounded"
            placeholder="Aadhaar Number"
            maxLength={12}
            onChange={(e) =>
              setForm({ ...form, aadhaar: e.target.value })
            }
          />

          <input
            type="number"
            className="w-full bg-slate-800 p-3 rounded"
            placeholder="Land Area"
            onChange={(e) =>
              setForm({ ...form, landArea: e.target.value })
            }
          />

          <select
            className="w-full bg-slate-800 p-3 rounded"
            onChange={(e) =>
              setForm({ ...form, landUnit: e.target.value })
            }
          >
            <option value="acre">Acre</option>
            <option value="sqft">Sq Ft</option>
          </select>
        </>
      )}

      {/* Company */}
      {isSignup && role === "company" && (
        <input
          className="w-full bg-slate-800 p-3 rounded"
          placeholder="Company Name"
          onChange={(e) =>
            setForm({ ...form, companyName: e.target.value })
          }
        />
      )}

      <button
        onClick={submit}
        className="w-full bg-primary py-3 rounded hover:bg-teal-700"
      >
        {isSignup ? "Create Account" : "Login"}
      </button>
    </div>
  );
}
