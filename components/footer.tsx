"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, Mail, Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#api" },
    { name: "Roadmap", href: "#roadmap" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "/contact-us" },
  ],
  resources: [
    { name: "Documentation", href: "#docs" },
    { name: "Guides", href: "#guides" },
    { name: "Help Center", href: "#help" },
    { name: "Status", href: "#status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Contact Us", href: "/contact-us" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/ikodio", label: "Twitter" },
  { icon: Github, href: "https://github.com/ikodio", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/ikodio", label: "LinkedIn" },
  { icon: Mail, href: "mailto:info@ikodio.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-lg font-semibold text-white">Ikodio</span>
            </Link>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">
              AI-powered stock trading platform that helps you make smarter
              investment decisions.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-zinc-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} Ikodio. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-zinc-500">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/contact-us"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
