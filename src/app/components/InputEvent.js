"use client";
import { useState } from "react";

export const InputEvent = ({ 
  label, icon: Icon, name, type = "text", 
  placeholder, value, onChange, required = false, rows = 4,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isTextArea = type === "textarea";

  return (
    <div className="group space-y-2 w-full">
      <label className={`text-[11px] font-black uppercase tracking-[1px] ml-1 flex items-center gap-2 transition-colors duration-300 ${isFocused ? "text-[#002FA7]" : "text-gray-400"}`}>
        {Icon && <Icon size={14} className={`transition-transform duration-300 ${isFocused ? "scale-110" : ""}`} />} 
        {label}
      </label>

      <div className="relative">
        {isTextArea ? (
          <textarea
            {...props}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            rows={rows}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full p-4 pl-5 rounded-2xl font-medium outline-none transition-all duration-300 bg-gray-50 border border-gray-100 text-gray-700 placeholder:text-gray-300 focus:bg-white focus:border-[#002FA7]/30 focus:ring-4 focus:ring-[#002FA7]/5 resize-none shadow-sm"
          />
        ) : (
          <input 
            {...props}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full p-4 pl-5 rounded-2xl font-medium outline-none transition-all duration-300 bg-gray-50 border border-gray-100 text-gray-700 placeholder:text-gray-300 focus:bg-white focus:border-[#002FA7]/30 focus:ring-4 focus:ring-[#002FA7]/5 shadow-sm"
          />
        )}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-[#002FA7] transition-all duration-300 ${isFocused ? "h-6 opacity-100" : "h-0 opacity-0"}`} />
      </div>
    </div>
  );
};