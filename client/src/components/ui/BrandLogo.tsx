'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function BrandLogo({ className = '', width = 120, height = 60 }: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Fallback while mounting to prevent layout shift
    return <div style={{ width, height }} className={className} />;
  }

  const isDark = resolvedTheme === 'dark';
  
  return (
    <Image
      src={isDark ? '/logodark.jpeg' : '/logo sun.jpeg'}
      alt="A-List Home Pros"
      width={width}
      height={height}
      className={`${className} object-contain transition-opacity duration-300`}
      priority
    />
  );
}
