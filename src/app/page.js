"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "./login/page.js";
import { useAuth } from "./services/AuthContext.js";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/events");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002FA7]"></div>
          <p className="text-gray-500 font-medium animate-pulse">Vérification de la session...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return null;
}