import { FC, ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  icon: ReactNode;
  href?: string; // href is optional now
}

const FancyButton: FC<ButtonProps> = ({ text, icon, href }) => {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevents any event conflicts
    console.log("✅ Button Clicked!");
  };

  const content = (
    <div 
      className="group bg-black hover:bg-transparent text-primary-foreground hover:text-black 
                rounded-[108em] py-5 px-10 flex items-center gap-2 font-bold text-3xl cursor-pointer"
      onClick={handleClick} // Ensure clicks register
      onTouchEnd={handleClick} // Ensure mobile taps register
    >
      <span>{text}</span>
      <span className="group-hover:translate-x-[.75vw] transition-transform duration-100">
        {icon}
      </span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : <button className="fancy-btn">{content}</button>;
};


export default FancyButton;
