import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Plus, Trophy, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link to="/" className="font-bold text-xl mr-8">
          30Day
        </Link>

        {user ? (
          <>
            <div className="flex space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="flex gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/challenges/create">
                <Button variant="ghost" className="flex gap-2">
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" className="flex gap-2">
                  <Trophy className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                variant="ghost"
                className="flex gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="ml-auto">
            <Link to="/login">
              <Button variant="ghost" className="flex gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
