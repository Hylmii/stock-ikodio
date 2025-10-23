"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Create smooth scrolling instance
    const smoother = ScrollSmoother.create({
      smooth: 1.5, // Smoothness level (higher = smoother)
      effects: true, // Enable data-speed effects
      smoothTouch: 0.1, // Smooth scrolling on touch devices
      normalizeScroll: true, // Prevent scroll jacking
    });

    // Cleanup
    return () => {
      smoother?.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
