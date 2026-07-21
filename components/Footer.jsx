"use client";
import React from "react";
import { C } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: C.line }}>
      <div className="max-w-6xl mx-auto px-5 py-14 grid sm:grid-cols-3 gap-10">
        <div>
          <span className="aeb-display font-semibold">AI Education Builders</span>
          <p className="mt-3 text-sm" style={{ color: C.slate }}>
            Making world-class, AI-powered education accessible to every African — built by the builders it's meant to serve.
          </p>
        </div>
        <div>
          <p className="aeb-mono text-xs" style={{ color: C.slate }}>CONTACT</p>
          <p className="mt-3 text-sm">hello@aieducationbuilders.africa</p>
          <div className="flex gap-4 mt-3 text-sm">
            <a href="#" className="aeb-focus underline">Twitter/X</a>
            <a href="#" className="aeb-focus underline">Instagram</a>
            <a href="#" className="aeb-focus underline">LinkedIn</a>
          </div>
        </div>
        <div>
          <p className="aeb-mono text-xs" style={{ color: C.slate }}>LEGAL</p>
          <div className="flex flex-col gap-2 mt-3 text-sm">
            <a href="#" className="aeb-focus underline w-fit">Privacy Policy</a>
            <a href="#" className="aeb-focus underline w-fit">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 pb-8 text-xs" style={{ color: C.slate }}>
        © {new Date().getFullYear()} AI Education Builders Program. All rights reserved.
      </div>
    </footer>
  );
}
