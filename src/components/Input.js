"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Composant Input Réutilisable (Design Mobile-to-Web)
 * @param {string} label - Le texte au-dessus de l'input
 * @param {string} error - Message d'erreur à afficher
 * @param {boolean} touched - Indique si l'input a été manipulé (pour afficher l'erreur)
 * @param {boolean} isPassword - Si vrai, active l'icône de visibilité
 */
export const Input = ({
  label,
  error,
  touched,
  isPassword,
  className = "",
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasError = error && touched;

  return (
    <div className="w-full mb-5">
      <label className="block text-[#1A1A1A] font-semibold text-sm mb-1 ml-1">
        {label}
      </label>
      
      <div 
        className={`
          flex items-center bg-[#F2F2F2] rounded-2xl h-[56px] px-4 border transition-all
          ${hasError ? 'border-[#B00020]' : 'border-transparent focus-within:border-[#002FA7]'}
        `}
      >
        <input
          className={`
            flex-1 bg-transparent outline-none text-[#1A1A1A] text-[15px] placeholder:text-[#666666]
            ${className}
          `}
          type={isPassword && !isPasswordVisible ? "password" : "text"}
          {...props}
        />
   
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-1 text-[#666666] hover:text-[#4571e1] transition-colors focus:outline-none"
          >
            {isPasswordVisible ? (
              <Eye size={20} />
            ) : (
              <EyeOff size={20} />
            )}
          </button>
        )}
      </div>
      {hasError && (
        <p className="text-[#B00020] text-[12px] mt-1 ml-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};