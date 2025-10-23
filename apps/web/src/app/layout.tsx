import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Ikodiomain - Web",
  description: "A modern web application built with Next.js and Turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}