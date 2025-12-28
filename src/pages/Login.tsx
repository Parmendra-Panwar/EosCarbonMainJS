import AuthForm from "../components/auth/AuthForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm mode="login" />
    </div>
  );
}
