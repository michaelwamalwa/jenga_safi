declare module "react-water-wave" {
    import { FC, ReactNode } from "react";

    interface WaterWaveProps {
        imageUrl: string;
        dropRadius?: number;
        pertubance?: number;
        resolution?: number;
        children?: ReactNode;
    }

    const WaterWave: FC<WaterWaveProps>;
    export default WaterWave;
}
