import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./components/home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Dashboard from "./components/dashboard";
import CreateChallenge from "./components/challenges/create";
import Profile from "./components/profile";
import TrackProgress from "./components/progress";
import ProtectedRoute from "./components/protected-route";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges/create"
              element={
                <ProtectedRoute>
                  <CreateChallenge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress/:id"
              element={
                <ProtectedRoute>
                  <TrackProgress />
                </ProtectedRoute>
              }
            />
            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
          </Routes>
        </Layout>
        <Toaster />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
