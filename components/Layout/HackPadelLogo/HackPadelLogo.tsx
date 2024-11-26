"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface HackPadelLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const ORIGINAL_WIDTH = 300;
const ORIGINAL_HEIGHT = 150;
const ASPECT_RATIO = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;

const HackPadelLogo: React.FC<HackPadelLogoProps> = ({
  className,
  width,
  height,
}) => {
  const [dimensions, setDimensions] = useState({
    width: ORIGINAL_WIDTH,
    height: ORIGINAL_HEIGHT,
  });

  useEffect(() => {
    if (width && !height) {
      setDimensions({ width, height: Math.round(width / ASPECT_RATIO) });
    } else if (height && !width) {
      setDimensions({ width: Math.round(height * ASPECT_RATIO), height });
    } else if (width && height) {
      setDimensions({ width, height });
    }
  }, [width, height]);

  return (
    <Image
      src="/img/hack-logo.png"
      alt="Hack Padel Logo"
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      style={{ width: "auto", height: "auto" }}
      priority
    />
  );
};

export default HackPadelLogo;
