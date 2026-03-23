"use client";

export const Button = ({ title, onClick, isLoading, variant = "primary" }) => {
  const baseStyle = "w-full py-4 rounded-2xl font-bold text-[16px] transition-all active:scale-[0.98] flex justify-center items-center shadow-sm";
  
  const variants = {
    primary: "bg-[#002FA7] text-white hover:bg-[#4571e1]",
    outline: "border-2 border-[#002FA7] text-[#002FA7] bg-transparent hover:bg-blue-50"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        title
      )}
    </button>
  );
};