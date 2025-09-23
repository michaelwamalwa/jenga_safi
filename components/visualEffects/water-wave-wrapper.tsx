"use client";
import { FC, ReactNode } from "react";
import WaterWave from "react-water-wave";

interface WaterWaveWrapperProps {
  imageUrl: string;
  dropRadius: number;
  perturbance: number;
  resolution: number;
  children: () => ReactNode;
}

const WaterWaveWrapper: FC<WaterWaveWrapperProps> = ({
  imageUrl,
  dropRadius,
  perturbance,
  resolution,
  children,
}) => {
  return <WaterWave
  imageUrl={imageUrl}
  dropRadius={dropRadius}
  pertubance={perturbance}
  resolution={resolution}
  >{children()}</WaterWave>;
};

export default WaterWaveWrapper;