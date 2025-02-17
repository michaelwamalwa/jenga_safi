"use client";
import { FC, ReactNode } from "react";
import WaterWave from "react-water-wave";

interface WaterWaveWrapperProps {
  imageUrl: string;
  dropRadius: string;
  pertubance: string;
  resolution: string;
  children: () => ReactNode;
}

const WaterWaveWrapper: FC<WaterWaveWrapperProps> = ({
  imageUrl,
  dropRadius,
  pertubance,
  resolution,
  children,
}) => {
  return <WaterWave
  imageUrl={imageUrl}
  dropRadius={dropRadius}
  pertubance={pertubance}
  resolution={resolution}
  >{children}</WaterWave>;
};

export default WaterWaveWrapper;