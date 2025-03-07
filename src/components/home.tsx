import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Link, Navigate } from "react-router-dom";

function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">30-Day Challenge Tracker</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Join our community of goal-setters and track your progress through
        engaging 30-day challenges. Whether it's fitness, learning, or personal
        growth, we're here to help you succeed.
      </p>
      <div className="flex gap-4">
        <Link to="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
