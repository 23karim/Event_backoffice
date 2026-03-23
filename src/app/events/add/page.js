"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  CheckCircle2, 
  Banknote, 
  Clock 
} from "lucide-react";
import eventService from "../../services/eventService";
import { InputEvent } from "../../../components/InputEvent";
import { Button } from "../../../components/Button";
import { useAuth } from "../../services/AuthContext";

export default function AddEventPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    titre: "", 
    description: "", 
    date_debut: "", 
    date_fin: "", 
    prix: "", 
    lieu: "" 
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const now = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) return setError("Session expirée. Veuillez vous reconnecter.");
    
    if (new Date(formData.date_debut) >= new Date(formData.date_fin)) {
      return setError("La date de fin doit être strictement après la date de début.");
    }

    setLoading(true);
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append("admin_id", user.id); 
    
    if (image) data.append("image", image);

    try {
      await eventService.addEvent(data);
      router.push("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création de l'événement");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002FA7]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#002FA7] transition-colors font-bold text-sm group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>
      </div>
      <div className="w-full max-w-xl bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,47,167,0.04)] border border-gray-100 overflow-hidden">
        <div className="bg-[#002FA7] p-6 text-white text-center">
          <h2 className="text-xl font-black tracking-tight flex items-center justify-center gap-3">
            <CheckCircle2 size={24} /> Créer un événement
          </h2>
          <p className="text-blue-100/70 text-xs mt-1 font-medium">Publiez votre activité avec dates et tarifs.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-xs font-bold animate-pulse text-center">
              {error}
            </div>
          )}
          <InputEvent label="Nom de l'événement" icon={Type} name="titre" placeholder="Ex: Festival de Musique" value={formData.titre} onChange={handleChange} required />
          <InputEvent type="textarea" label="Description" icon={AlignLeft} name="description" placeholder="Détails de l'événement..." value={formData.description} onChange={handleChange} required rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputEvent type="datetime-local" label="Début (Date & Heure)" icon={Calendar} name="date_debut" value={formData.date_debut} onChange={handleChange} min={now} required />
            <InputEvent type="datetime-local" label="Fin (Date & Heure)" icon={Clock} name="date_fin" value={formData.date_fin} onChange={handleChange} min={formData.date_debut || now} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputEvent label="Lieu" icon={MapPin} name="lieu" placeholder="Ex: Palais des Congrès" value={formData.lieu} onChange={handleChange} required />
            <InputEvent type="number" label="Prix (DT)" icon={Banknote} name="prix" placeholder="Ex: 50" value={formData.prix} onChange={handleChange} required />
          </div>

   
          <div className="group space-y-2 w-full">
            <label className="text-[10px] font-black uppercase tracking-[1px] ml-1 flex items-center gap-2 text-gray-400 group-hover:text-[#002FA7] transition-colors duration-300">
              <ImageIcon size={12} /> Image de couverture
            </label>
            
            <div className="relative">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className={`relative border-2 border-dashed rounded-[20px] p-6 flex flex-col items-center justify-center transition-all duration-300 z-10 bg-gray-50 border-gray-100 group-hover:bg-white group-hover:border-[#002FA7]/30 ${preview ? 'border-[#002FA7]/40 bg-blue-50/5' : ''}`}>
                {preview ? (
                  <div className="relative w-full h-32">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-sm" />
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-300 group-hover:text-[#002FA7] mb-2 border border-gray-50">
                      <ImageIcon size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-400">Ajouter une photo</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Button 
              title="Publier l'événement" 
              type="submit" 
              isLoading={loading} 
              variant="primary"
              className="!font-black !uppercase !tracking-[1.5px] !py-4 w-full" 
            />
          </div>
        </form>
      </div>
    </div>
  );
}