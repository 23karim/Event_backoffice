"use client";

import { useEffect, useState } from "react";
import eventService from "../../../services/eventService"; 
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Mail, Phone, Search, Trash2, ExternalLink } from "lucide-react";
import { EventCard } from "../../../../components/EventCard";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { useAuth } from "../../../services/AuthContext";

export default function EventDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth(); 
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=002FA7&color=fff&bold=true`;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchAllData = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
        const res = await eventService.getEventParticipants(id);
        setParticipants(res.participants || res || []);
      } catch (err) {
        console.error("Erreur chargement détails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, isAuthenticated, authLoading, router]);

  const filteredParticipants = participants.filter(p => 
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eventService.deleteEvent(id);
      router.push("/events");
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  if (authLoading || loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002FA7]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-[#002FA7] font-bold text-xs transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Retour au Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="scale-95 origin-top">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-2">Aperçu & Planning</h3>
                <EventCard 
                  event={event} 
                  onDelete={() => setIsModalOpen(true)} 
                  showDetailsButton={false} 
                  isFullPage={true}
                  showTime={true} 
                />
            </div>
            <div className="bg-[#002FA7] rounded-[24px] p-5 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-wider">Taux d'occupation</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-black">{participants.length}</span>
                    <span className="text-blue-300 text-xs font-bold mb-1">Inscrits</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full mt-4">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                  </div>
               </div>
               <Users className="absolute -right-4 -bottom-4 text-white/10" size={100} />
            </div>
          </div>
          <div className="lg:col-span-8 bg-white rounded-[28px] shadow-[0_15px_40px_rgba(0,47,167,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white">
              <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Liste des inscrits</h4>
              <div className="relative w-full max-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="w-full pl-9 pr-4 h-9 bg-gray-50 rounded-lg border-none focus:ring-1 focus:ring-[#002FA7]/20 outline-none text-[11px] font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">Participant</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((p) => (
                      <tr key={p.id} className="group hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || getAvatarUrl(p.fullName)}
                              alt={p.fullName}
                              className="w-9 h-9 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                            />
                            <span className="font-bold text-gray-800 text-xs">{p.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-bold text-[#002FA7] flex items-center gap-1.5">
                              <Phone size={10} /> {p.telephone || "N/A"}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium italic">
                              {p.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 text-gray-300 hover:text-[#002FA7] transition-all">
                              <ExternalLink size={14} />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-400 text-xs font-bold italic">
                        Aucune inscription pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'événement ?"
        message="Cette action est irréversible et supprimera tous les participants inscrits."
      />
    </div>
  );
}