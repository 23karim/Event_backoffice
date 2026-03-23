"use client";
import { Calendar, MapPin, Trash2, ArrowRight, Clock } from "lucide-react"; 
import Link from "next/link";

export const EventCard = ({ event, onDelete, showDetailsButton = false, isFullPage = false, showTime = false }) => {
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:5000${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  };

  const formatDateRange = (start, end) => {
    if (!start) return "Date à définir";
    
    const dateOptions = { day: 'numeric', month: 'short' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const startDate = new Date(start);
    const dateDebStr = startDate.toLocaleDateString('fr-FR', dateOptions);
    const heureDebStr = startDate.toLocaleTimeString('fr-FR', timeOptions);

    if (!end) return `${dateDebStr} à ${heureDebStr}`;

    const endDate = new Date(end);
    const dateFinStr = endDate.toLocaleDateString('fr-FR', dateOptions);
    const heureFinStr = endDate.toLocaleTimeString('fr-FR', timeOptions);
    if (dateDebStr === dateFinStr) {
      return showTime 
        ? `${dateDebStr} • ${heureDebStr} - ${heureFinStr}` 
        : dateDebStr;
    } 
    return showTime 
      ? `${dateDebStr} (${heureDebStr}) - ${dateFinStr} (${heureFinStr})`
      : `${dateDebStr} - ${dateFinStr}`;
  };

  if (!event) return null;

  const prixNombre = Number(event.prix);

  return (
    <div className={`group bg-white rounded-[20px] border border-gray-100 transition-all duration-500 flex flex-col relative overflow-hidden h-full w-full ${!isFullPage ? 'hover:border-blue-100 hover:shadow-[0_15px_40px_rgba(0,47,167,0.05)]' : 'shadow-sm'}`}>
      
      <div className="relative h-40 overflow-hidden">
        <img 
          src={getImageUrl(event.image)} 
          alt={event.titre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className={`absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm transition-colors duration-300
          ${prixNombre === 0 
            ? 'bg-emerald-500/90 text-white' 
            : 'bg-white/90 text-[#002FA7]'
          }`}>
          {prixNombre === 0 ? "Gratuit" : `${prixNombre} DT`} 
        </span>
        <div className="absolute top-3 right-3 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={() => onDelete(event.id)}
            className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-lg shadow-xl hover:bg-red-600 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        
        <div className="flex flex-col gap-y-1.5 text-[9px] text-gray-400 mb-2 font-bold uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            {showTime ? <Clock size={12} className="text-[#002FA7]" /> : <Calendar size={12} className="text-[#002FA7]" />}
            <span>{formatDateRange(event.date_debut, event.date_fin)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[#002FA7]" />
            <span className="line-clamp-1">{event.lieu}</span>
          </div>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
          {event.titre}
        </h3>
        <p className={`text-gray-500 text-xs leading-relaxed mb-4 ${!isFullPage ? 'line-clamp-2' : ''}`}>
          {event.description}
        </p>

        {showDetailsButton && (
          <div className="mt-auto pt-1">
            <Link 
              href={`/events/details/${event.id}`} 
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold text-xs bg-gray-50 text-gray-900 hover:bg-[#002FA7] hover:text-white transition-all group/btn"
            >
              Détails <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};