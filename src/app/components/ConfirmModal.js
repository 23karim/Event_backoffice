"use client";

import { Trash2, AlertTriangle } from "lucide-react";

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6 mx-auto ring-8 ring-red-50/50">
          <Trash2 size={38} strokeWidth={1.5} />
        </div>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
            {title || "Confirmation"}
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            {message || "Êtes-vous sûr de vouloir continuer ?"}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Suppression...
              </>
            ) : (
              "Confirmer la suppression"
            )}
          </button>
          
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all active:scale-95"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};