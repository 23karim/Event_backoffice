"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../../components/Input.js";
import { Button } from "../../components/Button.js";
import { useAuth } from "../services/AuthContext.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/events");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);

      router.replace("/events"); 
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants ou connexion impossibles");
      setIsLoading(false);
    }
  };
  if (authLoading || isAuthenticated) {
    return null; 
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#EDF2F7] to-[#E2E8F0] overflow-hidden">
      
 
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-[#002FA7]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[440px] px-6">

        <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80">
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              Connexion
            </h1>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-[13px] text-[#B00020] border border-red-100 animate-in fade-in slide-in-from-top-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-gray-500 ml-1">Email</label>
                <Input
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!bg-white/50 !border-gray-200 focus:!border-[#002FA7] !h-12 !rounded-xl transition-all"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[13px] font-semibold text-gray-500">Mot de passe</label>
                </div>
                <Input
                  placeholder="••••••••"
                  isPassword={true}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!bg-white/50 !border-gray-200 focus:!border-[#002FA7] !h-12 !rounded-xl transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                title="Se connecter" 
                type="submit" 
                isLoading={isLoading} 
                className="w-full h-12 rounded-xl bg-[#002FA7] hover:bg-[#002585] text-white font-bold text-sm shadow-md shadow-blue-700/10 transition-all active:scale-[0.98]"
              />
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-[13px] font-medium">
              Vous n'avez pas de compte ?
              <Link 
                href="/signup" 
                className="text-[#002FA7] font-bold hover:underline underline-offset-4 ml-1"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-400 text-[11px] tracking-widest uppercase opacity-70">
          &copy; 2026 Votre Plateforme
        </p>
      </div>
    </div>
  );
}