"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealText({
  children,
  className = "",
  delay = 0,
}: RevealTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, {
      type: "lines,words,chars",
      linesClass: "split-line",
    });

    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: textRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      rotationX: -90,
      transformOrigin: "50% 50%",
      stagger: 0.02,
      duration: 0.8,
      delay,
      ease: "back.out(1.5)",
    });

    return () => {
      split.revert();
    };
  }, [delay]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function RevealImage({ src, alt, className = "" }: RevealImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const image = imageRef.current.querySelector("img");
    const overlay = imageRef.current.querySelector(".image-overlay");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    // Overlay slides across
    tl.to(overlay, {
      scaleX: 0,
      transformOrigin: "right",
      duration: 1.2,
      ease: "expo.inOut",
    });

    // Image scales up and fades in
    tl.from(
      image,
      {
        scale: 1.3,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
      "-=1"
    );
  }, []);

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div className="image-overlay absolute inset-0 bg-[#0A0A0A] z-10" />
    </div>
  );
}
