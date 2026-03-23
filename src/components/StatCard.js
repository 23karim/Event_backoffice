"use client";

export const StatCard = ({ title, value, icon, colorClass, hoverBorder }) => {
  return (
    <div className={`
      relative overflow-hidden group
      bg-white/70 backdrop-blur-md
      p-4 rounded-[12px] 
      border border-gray-100 
      hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]
      hover:border-transparent
      transition-all duration-500 ease-out
      flex  items-center justify-center gap-5
    `}>
      
      <div className={`
        relative z-10
        w-16 h-16 rounded-[10px] 
        flex items-center justify-center 
        shadow-sm group-hover:shadow-lg
        group-hover:-translate-y-1 group-hover:rotate-3
        transition-all duration-500
        ${colorClass}
      `}>
  
        <div className="drop-shadow-md">
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1 group-hover:text-gray-500 transition-colors">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <p className="text-4xl font-black text-gray-900 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
            {value}
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20 group-hover:animate-pulse" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-current opacity-40 group-hover:w-full transition-all duration-700 ease-in-out" />
    </div>
  );
};