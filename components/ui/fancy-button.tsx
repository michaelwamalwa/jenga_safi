import { FC, ReactNode } from "react";

interface ButtonProps {
  text: string;
  icon: ReactNode;
  onClick?: () => void; // Make it clickable
}

const FancyButton: FC<ButtonProps> = ({ text, icon, onClick }) => {
  return (
    <button 
      className="fancy-btn group bg-black hover:bg-transparent text-primary-foreground hover:text-black 
                 rounded-[108em] py-5 px-10 flex items-center gap-2 font-bold text-3xl touch-manipulation"
      onClick={onClick} // Ensure click works
    >
      <span>{text}</span>
      <span className="group-hover:translate-x-[.75vw] transition-transform duration-100">
        {icon}
      </span>
    </button>
  );
};

export default FancyButton;
