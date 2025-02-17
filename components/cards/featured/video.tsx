import { FC, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoProps {
  video: string;
  active: boolean;
}

const Video: FC<VideoProps> = ({ video, active }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);  // Track hover state

  useEffect(() => {
    if (videoRef.current) {
      console.log("Video Source URL:", video); // Log the actual video source
      videoRef.current.onerror = () => {
        console.error("Video failed to load. Check the source:", video);
      };

      if (active && isHovered) {
        videoRef.current.play().catch((error) => {
          console.error("Video play error:", error);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [active, video, isHovered]);

  return (
    <div
      className="relative h-full w-full rounded-3xl"
      onMouseEnter={() => setIsHovered(true)}  // Set hover state to true
      onMouseLeave={() => setIsHovered(false)}  // Set hover state to false
    >
      {video ? (
        <video
          src={video}  // Ensure this is the correct video path
          ref={videoRef}
          loop={active && isHovered}  // Loop only when active and hovered
          muted
          className={cn("h-full w-full object-cover rounded-3xl", isHovered ? "" : "grayscale")}
        />
      ) : (
        <p className="text-center text-gray-500">No video source provided</p>
      )}
    </div>
  );
};

export default Video;
