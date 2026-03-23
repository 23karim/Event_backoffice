"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react"; 
import userService from "../services/userService";
import { Input } from "../../components/Input.js";
import { Button } from "../../components/Button.js";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      if (name === "tel" && value.length > 8) return;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.tel.length !== 8) {
      setError("Le numéro de téléphone doit contenir exactement 8 chiffres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') data.append(key, formData[key]);
      });
      data.append("role", "admin");

      await userService.signup(data, true);
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] via-[#EDF2F7] to-[#E2E8F0] overflow-hidden py-12 px-4">
      
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#002FA7]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[500px]">
        <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80">
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              Créer un compte Admin
            </h1>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-[13px] text-[#B00020] border border-red-100">
              <span className="font-semibold text-center w-full">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nom" name="nom" placeholder="Ex: admin" required value={formData.nom} onChange={handleChange} className="!bg-white/50 !border-gray-200 !h-11 !rounded-xl" />
              <Input label="Prénom" name="prenom" placeholder="Ex: admin" required value={formData.prenom} onChange={handleChange} className="!bg-white/50 !border-gray-200 !h-11 !rounded-xl" />
            </div>

            <Input label="Email" name="email" type="email" placeholder="admin@votreplateforme.com" required value={formData.email} onChange={handleChange} className="!bg-white/50 !border-gray-200 !h-11 !rounded-xl" />

            <Input label="Téléphone" name="tel" type="number" placeholder="8 chiffres (ex: 22111333)" required value={formData.tel} onChange={handleChange} className="!bg-white/50 !border-gray-200 !h-11 !rounded-xl" />
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Mot de passe"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="!bg-white/50 !border-gray-200 !h-11 !rounded-xl pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-[#002FA7]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmation du mot de passe"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="!bg-white/50 !border-gray-200 !h-11 !rounded-xl pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-[#002FA7]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider ml-1">Photo de profil</label>
              <div className="flex items-center gap-3">
                {preview && (
                  <div className="h-11 w-11 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                    <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1 flex items-center justify-center bg-white/40 border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-[#002FA7]/30 transition-all cursor-pointer relative">
                  <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full text-[12px] opacity-0 absolute inset-0 cursor-pointer" />
                  <span className="text-[11px] text-[#002FA7] font-bold">
                    {formData.image ? "Image sélectionnée" : "Choisir une photo"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button title="Inscription" type="submit" isLoading={loading} className="w-full h-12 rounded-xl bg-[#002FA7] hover:bg-[#002585] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]" />
            </div>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-[13px] font-medium">
              Déjà un compte ?
              <Link href="/login" className="text-[#002FA7] font-bold hover:underline ml-1">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}