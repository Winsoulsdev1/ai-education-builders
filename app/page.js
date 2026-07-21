"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowRight, Radio, Compass, Target, Users, ShieldCheck,
} from "lucide-react";
import { C, Pill, PrimaryButton, GhostButton, SectionLabel } from "../components/ui";
import { TRACKS, TOTAL_SEATS, sbFetch } from "../lib/supabase";

function BuilderRoster({ filled }) {
  const slots = Array.from({ length: TOTAL_SEATS }, (_, i) => i);
  return (
    <div className="grid grid-cols-10 gap-1.5 max-w-md mx-auto md:mx-0">
      {slots.map((i) => {
        const isFilled = i < filled;
        return (
          <div
            key={i}
            className="aeb-slot aeb-pop aspect-square rounded-[4px]"
            style={{
              animationDelay: `${Math.min(i * 12, 900)}ms`,
              background: isFilled ? C.blue : C.mist,
              border: `1px solid ${isFilled ? C.blue : C.line}`,
            }}
            title={isFilled ? `Builder #${String(i + 1).padStart(3, "0")} — claimed` : `Seat #${String(i + 1).padStart(3, "0")} — open`}
          />
        );
      })}
    </div>
  );
}

export default function Home() {
  const [applicantCount, setApplicantCount] = useState(0);

  const refreshCount = useCallback(async () => {
    try {
      const total = await sbFetch("/rest/v1/rpc/applicant_count", { method: "POST", body: {} });
      if (typeof total === "number") setApplicantCount(total);
    } catch {
      // fails quietly if the applicant_count() function isn't set up yet
    }
  }, []);

  useEffect(() => { refreshCount(); }, [refreshCount]);

  const filled = Math.min(applicantCount, TOTAL_SEATS);
  const remaining = Math.max(TOTAL_SEATS - filled, 0);

  const aboutItems = [
    { icon: Compass, title: "Our vision", body: "A continent where world-class, AI-powered education reaches every learner, regardless of income, location or background — built by Africans, for Africans." },
    { icon: Target, title: "Why Africa needs AI in education", body: "Millions of African students still lack access to quality teaching, feedback and mentorship. AI can close that gap at a scale traditional systems never could — if the people building it understand the continent it serves." },
    { icon: Users, title: "Why we're building this movement", body: "The tools that will transform African education won't be imported. They'll be built by young Africans who understand the problem first-hand. This program exists to train that generation of builders." },
    { icon: ShieldCheck, title: "Why skills matter more than certificates", body: "We're not handing out certificates for attendance. We're handing responsibility to people who can prove — through real, shipped work — that they can build. Curiosity, discipline and consistency matter more than what's already on your CV." },
  ];

  const reqs = [
    "Own a smartphone", "Have internet access", "Are committed to learning, not just curious",
    "Can dedicate at least 10 hours a week", "Are willing to work with a team",
    "Love solving problems more than collecting certificates",
  ];

  const receiveList = [
    "A structured learning roadmap for your track", "Weekly mentorship from people building in the field",
    "Practical projects, not just theory", "A team of builders to work alongside",
    "A real portfolio of shipped work", "The chance to build real AI products for African classrooms",
    "Leadership development as you grow with the cohort",
  ];

  return (
    <>
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="aeb-fade-up">
          <Pill><Radio size={12} /> COHORT 1 · {remaining} OF {TOTAL_SEATS} SEATS OPEN</Pill>
          <h1 className="aeb-display font-semibold leading-[1.05] mt-6 text-4xl sm:text-5xl">
            Build the Future of African Education with AI
          </h1>
          <p className="mt-5 text-lg" style={{ color: C.slate }}>
            Become one of the first 100 AI Education Builders. Join a community of young Africans
            learning to build AI solutions that will transform education across the continent —
            starting with nothing more than a smartphone and a decision to show up.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/apply"><PrimaryButton>Apply Now <ArrowRight size={16} /></PrimaryButton></Link>
            <a href="#about"><GhostButton>Read the mission</GhostButton></a>
          </div>
          <p className="aeb-mono text-xs mt-6" style={{ color: C.slate }}>
            NO PRIOR TECH EXPERIENCE REQUIRED · 10+ HRS/WEEK · SMARTPHONE ONLY
          </p>
        </div>
        <div className="aeb-fade-up" style={{ animationDelay: "150ms" }}>
          <BuilderRoster filled={filled} />
          <p className="text-center md:text-left text-sm mt-4" style={{ color: C.slate }}>
            Every filled square is a builder who has already claimed their seat in Cohort 1.
          </p>
        </div>
      </section>

      <section id="about" className="max-w-6xl mx-auto px-5 py-20">
        <SectionLabel>THE MISSION</SectionLabel>
<h2 className="aeb-display font-semibold text-3xl sm:text-4xl max-w-2xl">
          This is not a job application. It's a movement to build.
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 mt-12">
          {aboutItems.map((it) => (
            <div key={it.title} className="flex gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.ink }}>
                <it.icon size={18} color="#fff" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{it.title}</h3>
                <p className="mt-2" style={{ color: C.slate }}>{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20" style={{ background: C.mist }}>
        <div className="max-w-6xl mx-auto px-5">
          <SectionLabel>ELIGIBILITY</SectionLabel>
          <h2 className="aeb-display font-semibold text-3xl sm:text-4xl">Who can apply?</h2>
          <p className="mt-3 max-w-xl" style={{ color: C.slate }}>Anyone who:</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {reqs.map((r) => (
              <div key={r} className="flex items-start gap-3 bg-white rounded-xl p-4 border" style={{ borderColor: C.line }}>
                <CheckCircle2 size={20} style={{ color: C.blue }} className="shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
          <div className="mt-8"><Link href="/apply"><PrimaryButton>I meet this <ArrowRight size={16} /></PrimaryButton></Link></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-20">
        <SectionLabel>CHOOSE YOUR LANE</SectionLabel>
        <h2 className="aeb-display font-semibold text-3xl sm:text-4xl max-w-2xl">Twelve tracks. One mission.</h2>
        <p className="mt-3 max-w-xl" style={{ color: C.slate }}>You don't need to know which one is "yours" yet. You just need to be willing to start.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {TRACKS.map((t) => (
            <div key={t.id} className="aeb-card rounded-2xl p-6 border bg-white" style={{ borderColor: C.line }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: C.mist }}>
                <t.icon size={18} style={{ color: C.blue }} />
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm mt-1" style={{ color: C.slate }}>{t.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20" style={{ background: C.ink }}>
        <div className="max-w-6xl mx-auto px-5">
          <SectionLabel>WHAT YOU RECEIVE</SectionLabel>
          <h2 className="aeb-display font-semibold text-3xl sm:text-4xl text-white max-w-2xl">
            You're not signing up for a course. You're joining a build team.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {receiveList.map((l) => (
              <div key={l} className="flex items-start gap-3">
                <CheckCircle2 size={18} style={{ color: C.blueLight }} className="shrink-0 mt-1" />
                <span className="text-white/90">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-20 text-center">
        <h2 className="aeb-display font-semibold text-3xl sm:text-4xl">Ready to claim your seat?</h2>
        <p className="mt-3" style={{ color: C.slate }}>Applications for Cohort 1 are open now.</p>
        <div className="mt-8"><Link href="/apply"><PrimaryButton>Apply Now <ArrowRight size={16} /></PrimaryButton></Link></div>
      </section>
    </>
  );
              }
