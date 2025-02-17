import { ReactNode, FC } from "react";
import Header from "./header";
import Video from "./video";

interface FeaturedCardProps {
  logo?: ReactNode;
  title: string;
  tag: string;
  video: string;
  active: boolean;
}

const FeaturedCard: FC<FeaturedCardProps> = ({
  active,
  logo,
  title,
  tag,
  video,
}) => {
  return (
    <div className="link w-full h-full bg-secondary-background border border-border shadow-lg rounded-3xl cursor-pointer flex flex-col gap-2 p-2">
      {/* Header */}
      <Header title={title} tag={tag} />

      {/* Body */}
      <div className="relative w-full h-[550px] border border-border rounded-3xl bg-gray-100">
        {/* Video */}
        <Video video={video} active={active} />
      </div>
    </div>
  );
};

export default FeaturedCard;
