"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export function PageTransition() {
  useEffect(() => {
    // Page enter animation
    const tl = gsap.timeline();

    tl.from(".page-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    tl.from(
      ".fade-in-element",
      {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5"
    );
  }, []);

  return null;
}

export function createPageTransition() {
  const tl = gsap.timeline();

  // Overlay slide in
  tl.to(".page-overlay", {
    scaleX: 1,
    transformOrigin: "left",
    duration: 0.6,
    ease: "expo.inOut",
  });

  // Content fade out
  tl.to(
    ".page-content",
    {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: "power2.in",
    },
    "-=0.3"
  );

  return tl;
}
