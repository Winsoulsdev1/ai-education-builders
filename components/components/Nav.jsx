"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { C } from "./ui";

const LINKS = [
  { href: "/", label: "Mission" },
  { href: "/apply", label: "Apply" },
  { href: "/dashboard", label: "My Dashboard" },
  { href: "/admin", label: "Admin" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 backdrop-blur border-b" style={{ background: "rgba(255,255,255,0.85)", borderColor: C.line }}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="aeb-focus flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.ink }}>
            <Sparkles size={16} color="#fff" />
          </span>
          <span className="aeb-display font-semibold text-sm sm:text-base">AI Education Builders</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="aeb-focus px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: pathname === l.href ? C.mist : "transparent",
                color: pathname === l.href ? C.blue : C.slate,
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden aeb-focus" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t px-5 py-3 flex flex-col gap-1" style={{ borderColor: C.line }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="aeb-focus text-left px-4 py-3 rounded-lg text-sm font-medium"
              style={{ background: pathname === l.href ? C.mist : "transparent", color: pathname === l.href ? C.blue : C.ink }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
