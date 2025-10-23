"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    // Scroll progress bar
    gsap.to(progressRef.current, {
      scaleX: 1,
      transformOrigin: "left",
      ease: "none",
      scrollTrigger: {
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left scale-x-0"
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
