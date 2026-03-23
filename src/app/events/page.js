"use client";

import { useEffect, useState, useMemo } from "react";
import eventService from "../services/eventService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Calendar, CheckCircle2, Clock, BarChart3, Trash2 } from "lucide-react";

import { ConfirmModal } from "../../components/ConfirmModal";
import { EventCard } from "../../components/EventCard";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../services/AuthContext";

export default function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isDeleteAllMode, setIsDeleteAllMode] = useState(false);

  const router = useRouter();
  const { logout, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace("/"); 
      } else {
        fetchEvents();
      }
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents(1, 50);
      setEvents(data.events || []);
    } catch (err) {
      setError("Impossible de charger les événements pour le moment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: events.length,
      past: events.filter(e => e.date_debut && new Date(e.date_debut) < now).length,
      upcoming: events.filter(e => !e.date_debut || new Date(e.date_debut) >= now).length
    };
  }, [events]);

  const handleLogout = () => {
    logout(); 
  };

  const openDeleteModal = (eventId) => {
    setIsDeleteAllMode(false);
    setEventToDelete(eventId);
    setIsModalOpen(true);
  };
  const openDeleteAllModal = () => {
    setIsDeleteAllMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (isDeleteAllMode) {
        await eventService.deleteAllEvents();
        setEvents([]);
      } else {
        if (!eventToDelete) return;
        await eventService.deleteEvent(eventToDelete);
        setEvents(events.filter((event) => event.id !== eventToDelete));
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression.");
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
      setIsDeleteAllMode(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002FA7]"></div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#002FA7] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Calendar size={22} className="text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              EVE<span className="text-[#002FA7]">NT</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {events.length > 0 && (
              <button 
                onClick={openDeleteAllModal}
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Supprimer tout"
              >
                <Trash2 size={20} />
              </button>
            )}

            <Link href="/events/add" className="flex items-center gap-2 bg-[#002FA7] text-white px-5 py-2.5 rounded-xl hover:bg-[#002585] transition-all font-bold text-sm shadow-xl shadow-blue-100 active:scale-95">
              <Plus size={18} />
              Ajouter
            </Link>
            <button 
              onClick={handleLogout} 
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard 
              title="Total Events"
              value={loading ? "..." : stats.total}
              icon={<BarChart3 size={28} />}
              colorClass="bg-blue-50 text-blue-600"
              hoverBorder="hover:border-blue-200"
            />
            <StatCard 
              title="À venir"
              value={loading ? "..." : stats.upcoming}
              icon={<Clock size={28} />}
              colorClass="bg-emerald-50 text-emerald-600"
              hoverBorder="hover:border-emerald-200"
            />
            <StatCard 
              title="Passés"
              value={loading ? "..." : stats.past}
              icon={<CheckCircle2 size={28} />}
              colorClass="bg-orange-50 text-orange-600"
              hoverBorder="hover:border-orange-200"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] h-64 animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard
                  key={event.id} 
                  event={event} 
                  onDelete={openDeleteModal}
                  showDetailsButton={true}
                  showTime={true} 
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-[32px] border-2 border-dashed border-gray-100 text-center">
                  <div className="bg-gray-50 p-8 rounded-full mb-6 text-gray-200">
                      <Calendar size={48} />
                  </div>
                  <p className="text-gray-400 font-bold text-xl mb-2">Aucun événement trouvé</p>
                  <Link href="/events/add" className="bg-[#002FA7] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#002585] transition-all shadow-lg shadow-blue-100">
                      Créer mon premier événement
                  </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <ConfirmModal 
        isOpen={isModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={isDeleteAllMode ? "⚠️ Supprimer tout ?" : "Supprimer l'événement ?"}
        message={
            isDeleteAllMode 
            ? "Êtes-vous sûr de vouloir supprimer TOUS les événements ? Cette action videra toute la base de données."
            : "Cette action est irréversible. Toutes les données liées à cet événement seront définitivement supprimées."
        }
      />
    </div>
  );
}