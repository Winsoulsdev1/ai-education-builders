"use client";
import React from "react";
import { AlertCircle } from "lucide-react";

export const C = {
  ink: "#0B0F19",
  blue: "#1E4FD8",
  blueLight: "#4C7FFF",
  paper: "#FFFFFF",
  mist: "#F4F6FB",
  slate: "#5B6472",
  line: "#E4E8F0",
  good: "#1B8A5A",
  bad: "#C23B3B",
};

export function Pill({ children }) {
  return (
    <span
      className="aeb-mono inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full"
      style={{ background: C.mist, color: C.blue, border: `1px solid ${C.line}` }}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({ children, onClick, type = "button", full = false, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`aeb-btn-primary aeb-focus font-medium rounded-full px-6 py-3 inline-flex items-center justify-center gap-2 ${full ? "w-full" : ""}`}
      style={{ background: C.blue, color: "#fff", opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="aeb-focus font-medium rounded-full px-6 py-3 inline-flex items-center justify-center gap-2 border"
      style={{ borderColor: C.line, color: C.ink }}
    >
      {children}
    </button>
  );
}

export function SectionLabel({ children }) {
  return <div className="aeb-mono text-xs mb-3" style={{ color: C.blue }}>{children}</div>;
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <p className="text-sm flex items-start gap-2 mt-2" style={{ color: C.bad }}>
      <AlertCircle size={16} className="shrink-0 mt-0.5" /> {children}
    </p>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending: { label: "Under review", bg: C.mist, color: C.blue },
    accepted: { label: "Accepted", bg: "#E7F6EE", color: C.good },
    rejected: { label: "Not selected", bg: "#FBEAEA", color: C.bad },
  };
  const s = map[status] || map.pending;
  return <span className="aeb-mono text-xs px-3 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>{s.label.toUpperCase()}</span>;
}

export const inputStyle = { borderColor: C.line };
export const inputClass = "aeb-focus w-full rounded-lg border px-3.5 py-2.5 text-sm bg-white";

export function Field({ label, children, required }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}{required && <span style={{ color: C.bad }}> *</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
    }
