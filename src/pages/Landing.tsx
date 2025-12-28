import Button from "../components/ui/Button";
import UserCard from "../components/ui/UserCard";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Carbon Credit Management Platform
        </h1>
        <p className="text-muted max-w-2xl mx-auto">
          A unified system to monitor, validate, trade, and govern carbon
          credits across stakeholders.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Button variant="primary" onClick={() => navigate("/login")} > Login </Button>
          <Button variant="secondary" onClick={() => navigate("/signup")} > Signup </Button>
        </div>
      </section>

      {/* User Types */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UserCard
          title="Government"
          description="Policy oversight, compliance tracking, and national carbon accounting."
        />
        <UserCard
          title="NGO"
          description="Verification, auditing, and sustainability impact reporting."
        />
        <UserCard
          title="Farmer"
          description="Register land, earn credits, and monetize sustainable practices."
        />
        <UserCard
          title="Company"
          description="Purchase credits, offset emissions, and meet ESG goals."
        />
      </section>
    </div>
  );
}
