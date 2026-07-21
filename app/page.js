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
