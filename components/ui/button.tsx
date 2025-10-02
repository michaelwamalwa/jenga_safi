import { cn } from "@/lib/utils";
import Link from "@/node_modules/next/link";
import { FC, ReactNode,ButtonHTMLAttributes } from "react";

type Variant = "default" | "outline" | "ghost";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  link?: string;
  isIcon?: boolean;
  className?: string;
  variant?: Variant;
}

const Button: FC<ButtonProps> = ({ children, className, isIcon, link, ...props }) => {
  return (
    <>
      {link ? (
        <Link href={link} target="_blank" className="w-10 h-10 cursor-pointer">
          <ButtonBody className={className} isIcon={isIcon}>
            {children}
          </ButtonBody>
        </Link>
      ) : (
        <div>
          <button {...props} className="w-auto h-full">
          <ButtonBody className={className} isIcon={isIcon}>
            {children}
          </ButtonBody>
          </button>
         
        </div>
      )}
    </>
  );
};

interface ButtonBodyProps {
  children: ReactNode;
  isIcon?: boolean;
  className?: string;
}

const ButtonBody: FC<ButtonBodyProps> = ({ children, isIcon, className }) => {
  return (
    <div className="cursor-pointer flex-none w-auto h-full">
      <div
        className={cn(
          "flex items-center justify-center gap-2 bg-primary-background rounded-full select-none whitespace-nowrap text-primary-foreground text-sm font-medium hover:bg-white/[0.1] transition-colors duration-100",
          className,
          isIcon ? "h-10 w-10" : "h-full w-max px-3 py-2"
        )}
      >
        {/* Ensure content is centered if isIcon is true */}
        {isIcon ? (
          <div className="flex justify-center items-center w-full h-full">
            {children}
          </div>
        ) : (
          children // Corrected this line to directly render children without wrapping
        )}
      </div>
    </div>
  );
};

export default Button;
