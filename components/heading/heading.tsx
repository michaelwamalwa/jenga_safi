import { FC } from "react";
import SvgCurve from "../visualEffects/svg-curve";
import { HeadingAnimatedSvg } from "./heading.animated";

interface HeadingProps {
  number: string;
  title_1: string;
  title_2: string;
  textColor?: string; // now optional
}

const Heading: FC<HeadingProps> = ({ number, title_1, title_2, textColor }) => {
  return (
    <div className="relative my-16 px-6 lg:px-12 z-20">
      {/* Number in background */}
      <div className="absolute -top-24 left-6 lg:left-16 opacity-10 pointer-events-none">
        <h2 className="font-pixel text-[150px] md:text-[200px] text-green-500/80 bg-clip-text text-transparent bg-gradient-to-br from-green-500 via-emerald-400 to-lime-500 drop-shadow-md">
          {number}
        </h2>
      </div>

      {/* Titles */}
      <div className="flex items-center flex-nowrap w-full font-oswald">
        <p
          className={`text-[15vw] lg:text-[9vw] leading-[100%] mr-4 drop-shadow-sm ${
            textColor || "text-white"
          }`}
        >
          {title_1}
        </p>

        <HeadingAnimatedSvg text="LEARN MORE ABOUT OUR FEATURED PROJECTS" />

        <p
          className={`text-[15vw] lg:text-[9vw] leading-[100%] italic drop-shadow-sm ${
            textColor || "text-white"
          }`}
        >
          {title_2}
        </p>
      </div>

      {/* Decorative curve */}
      <div className="absolute left-0 w-full">
        <SvgCurve />
      </div>
    </div>
  );
};

export default Heading;
