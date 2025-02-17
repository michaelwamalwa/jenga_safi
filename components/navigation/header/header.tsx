import Link from "@/node_modules/next/link";
import FancyButton from "@/components/ui/fancy-button";
import Profile from "@/components/ui/profile";
import MagneticWrapper from "@/components/visualEffects/magnetic-wrapper";
import { FaMailchimp } from "react-icons/fa";

export default function Header() {
  return (
    <div className="w-full flex items-center justify-center md:justify-between">
      <Profile />
      
      <div className="hidden md:inline">
        <MagneticWrapper>
          <Link href="/signup">
            <FancyButton text="Join Us" icon={<FaMailchimp />} />
          </Link>
        </MagneticWrapper>
      </div>
    </div>
  );
}
