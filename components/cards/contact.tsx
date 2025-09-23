import { FC, ReactNode } from "react";
import Button from "../ui/button";

interface ContactCardProps {
  title: string;
  icon: ReactNode;
  text: string;
  btnText: string;
  className?: string;
}

const ContactCard: FC<ContactCardProps> = ({ icon, btnText, text, title }) => {
  return (
    <div className="bg-secondary-background border border-border rounded-lg p-6 shadow-md flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow">
          {icon}
        </span>
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
      <h2 className="font-bold text-xl text-gray-700">{text}</h2>
      <Button className="w-32">{btnText}</Button>
    </div>
  );
};

export default ContactCard;
