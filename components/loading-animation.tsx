"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function LoadingAnimation() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const tl = gsap.timeline();

    // Loader bars animation
    tl.to(".loader-bar", {
      scaleY: 1,
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
      },
      duration: 0.6,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0A0A0A]"
    >
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="loader-bar w-1 h-12 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full scale-y-0"
          />
        ))}
      </div>
    </div>
  );
}

export function hideLoader() {
  const tl = gsap.timeline();

  tl.to(".loader-bar", {
    scaleY: 0,
    stagger: 0.05,
    duration: 0.4,
    ease: "power2.in",
  });

  tl.to(
    ".loading-animation",
    {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        const loader = document.querySelector(".loading-animation");
        if (loader) {
          loader.remove();
        }
      },
    },
    "-=0.2"
  );
}
