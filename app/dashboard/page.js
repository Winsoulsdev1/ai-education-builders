"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { C, Pill, PrimaryButton, StatusBadge } from "../../components/ui";
import { TRACKS, CHECKLIST, ANNOUNCEMENTS } from "../../lib/supabase";

export default function Dashboard() {
  const [me, setMe] = useState(undefined);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("my-application");
      setMe(raw ? JSON.parse(raw) : null);
    } catch {
      setMe(null);
    }
  }, []);

  if (me === undefined) {
    return <div className="max-w-2xl mx-auto px-5 py-24 text-center" style={{ color: C.slate }}>Loading your dashboard…</div>;
  }
  if (!me) {
    return (
      <section className="max-w-lg mx-auto px-5 py-24 text-center">
        <h2 className="aeb-display font-semibold text-3xl">No application found on this device</h2>
        <p className="mt-3" style={{ color: C.slate }}>Submit an application to unlock your builder dashboard.</p>
        <div className="mt-8"><Link href="/apply"><PrimaryButton>Apply Now <ArrowRight size={16} /></PrimaryButton></Link></div>
      </section>
    );
  }

  const track = TRACKS.find((t) => t.id === me.track);

  return (
    <section className="max-w-3xl mx-auto px-5 py-16">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Pill>BUILDER #{String(me.builderNumber).padStart(3, "0")}</Pill>
          <h2 className="aeb-display font-semibold text-3xl mt-3">Welcome back, {me.fullName.split(" ")[0]}</h2>
        </div>
        <StatusBadge status={me.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-10">
        <div className="rounded-2xl p-6 border" style={{ borderColor: C.line }}>
          <p className="aeb-mono text-xs" style={{ color: C.slate }}>SELECTED TRACK</p>
          <div className="flex items-center gap-3 mt-3">
            {track && <track.icon size={20} style={{ color: C.blue }} />}
            <span className="font-semibold">{track ? track.name : "—"}</span>
          </div>
        </div>
        <div className="rounded-2xl p-6 border" style={{ borderColor: C.line }}>
          <p className="aeb-mono text-xs" style={{ color: C.slate }}>WEEKLY COMMITMENT</p>
          <p className="font-semibold mt-3">{me.hours} hours / week</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold text-lg">Onboarding checklist</h3>
        <div className="mt-4 space-y-2">
          {CHECKLIST.map((c, i) => (
            <button key={c} onClick={() => setChecked((s) => ({ ...s, [i]: !s[i] }))}
              className="aeb-focus w-full flex items-center gap-3 text-left rounded-lg border px-4 py-3" style={{ borderColor: C.line }}>
              {checked[i] ? <CheckCircle2 size={18} style={{ color: C.good }} /> : <Circle size={18} style={{ color: C.slate }} />}
              <span style={{ textDecoration: checked[i] ? "line-through" : "none", color: checked[i] ? C.slate : C.ink }}>{c}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold text-lg">Learning resources</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-xl p-4 border" style={{ borderColor: C.line, background: C.mist }}>
            <p className="font-medium text-sm">Cohort 1 Builder Handbook</p>
            <p className="text-xs mt-1" style={{ color: C.slate }}>Shared once your application is accepted.</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ borderColor: C.line, background: C.mist }}>
            <p className="font-medium text-sm">Track orientation deck — {track?.name}</p>
            <p className="text-xs mt-1" style={{ color: C.slate }}>Unlocks after orientation call.</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold text-lg">Announcements</h3>
        <div className="space-y-3 mt-4">
          {ANNOUNCEMENTS.map((a) => (
            <div key={a.title} className="rounded-xl p-4 border" style={{ borderColor: C.line }}>
              <p className="font-medium text-sm">{a.title}</p>
              <p className="text-sm mt-1" style={{ color: C.slate }}>{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
      }
