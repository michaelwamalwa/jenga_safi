import { FC, ReactNode } from "react";

interface ButtonProps {
  text: string;
  icon: ReactNode;
}

const FancyButton: FC<ButtonProps> = ({ text, icon }) => {
  return (
    <a className="fancy-btn">
      <div className="group bg-black hover:bg-transparent text-primary-foreground hover:text-black rounded-[108em] py-5 px-10 flex items-center gap-2 font-bold text-3xl ">
        <span>{text}</span>
        <span className="group-hover:translate-x-[.75vw] transition-transform duration-100">
          {icon}
        </span>
      </div>
      {/* Inner content */}
    </a>
  );
};

export default FancyButton;
