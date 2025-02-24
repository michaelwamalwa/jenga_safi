import { useEffect, useRef, useState, useCallback } from "react";

export default function SvgCurve() {
  const path = useRef<SVGPathElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  let progress = 0;
  let reqId: number | null = null;
  let x = 0.5;
  let time = Math.PI / 2;

  // Memoized function to prevent re-creation
  const setPath = useCallback((value: number) => {
    if (containerWidth > 0) {
      path.current?.setAttributeNS(
        null,
        "d",
        `M 0 50 Q ${containerWidth * x} ${50 + value} ${containerWidth} 50`
      );
    }
  }, [containerWidth, x]);

  useEffect(() => {
    if (container.current) {
      setContainerWidth(container.current.offsetWidth);
    }
  }, []);

  const animateIn = () => {
    if (reqId !== null) {
      cancelAnimationFrame(reqId);
      time = Math.PI / 2;
    }

    setPath(progress);
    reqId = requestAnimationFrame(animateIn);
  };

  const manageMouseMove = (e: React.MouseEvent) => {
    const { movementY } = e;
    const box = (e.target as HTMLElement).getBoundingClientRect();
    x = (e.clientX - box.left) / box.width;
    progress += movementY;
  };

  const resetAnimation = () => {
    cancelAnimationFrame(reqId);
    animateOut();
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const animateOut = () => {
    const newProgress = progress * Math.sin(time);
    setPath(newProgress);
    progress = lerp(progress, 0, 0.04);
    time += 0.2;

    if (Math.abs(progress) > 0.5) {
      reqId = requestAnimationFrame(animateOut);
    } else {
      time = Math.PI / 2;
      progress = 0;
    }
  };

  useEffect(() => {
    setPath(progress);

    const handleResize = () => {
      if (container.current) {
        setContainerWidth(container.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [progress, setPath]); // ✅ Now includes 'setPath'

  return (
    <div className="line" ref={container}>
      <span
        onMouseEnter={animateIn}
        onMouseLeave={resetAnimation}
        onMouseMove={manageMouseMove}
        className="box"
      ></span>
      <svg>
        <path ref={path}></path>
      </svg>
    </div>
  );
}
