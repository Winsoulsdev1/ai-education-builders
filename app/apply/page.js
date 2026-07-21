"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import {
  C, Pill, PrimaryButton, GhostButton, SectionLabel, ErrorNote,
  Field, inputClass, inputStyle,
} from "../../components/ui";
import { TRACKS, sbFetch, fromDb, toDb } from "../../lib/supabase";

const EMPTY_FORM = {
  fullName: "", email: "", phone: "", whatsapp: "", country: "", state: "",
  age: "", occupation: "", education: "", ownsSmartphone: "Yes", ownsLaptop: "No",
  track: TRACKS[0].id, reason: "", hours: "10-15", linkedin: "", github: "",
  portfolio: "", agree: false,
};

export default function Apply() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.email || !form.phone || !form.country || !form.age || !form.agree) {
      setError("Please fill in all required fields and accept the terms before submitting.");
      return;
    }
    setSubmitting(true);
try {
      const row = await sbFetch("/rest/v1/rpc/submit_application", {
        method: "POST",
        body: { payload: toDb(form) },
      });
      const applicant = fromDb(row);
      try {
        localStorage.setItem("my-application", JSON.stringify(applicant));
      } catch {}
      setDone(applicant);
    } catch (err) {
      if (String(err.message).toLowerCase().includes("duplicate")) {
        setError("An application with this email already exists. Check your dashboard for its status.");
      } else {
        setError(err.message || "Something went wrong saving your application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="max-w-xl mx-auto px-5 py-24 text-center aeb-fade-up">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: C.mist }}>
          <CheckCircle2 size={28} style={{ color: C.blue }} />
        </div>
        <Pill>BUILDER #{String(done.builderNumber).padStart(3, "0")}</Pill>
        <h2 className="aeb-display font-semibold text-3xl mt-4">You've claimed your seat, {done.fullName.split(" ")[0]}.</h2>
        <p className="mt-3" style={{ color: C.slate }}>
          Your application is saved. We'll review it and follow up by email or WhatsApp. Track your
          status any time from your dashboard on this device.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <PrimaryButton onClick={() => router.push("/dashboard")}>Go to my dashboard <ArrowRight size={16} /></PrimaryButton>
          <Link href="/"><GhostButton>Back to mission</GhostButton></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-5 py-16">
      <SectionLabel>APPLICATION — COHORT 1</SectionLabel>
      <h2 className="aeb-display font-semibold text-3xl sm:text-4xl">Claim your seat as a Builder</h2>
      <p className="mt-3" style={{ color: C.slate }}>Answer honestly. We're selecting for commitment and character, not polish.</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full name" required><input className={inputClass} style={inputStyle} value={form.fullName} onChange={set("fullName")} required /></Field>
          <Field label="Email" required><input type="email" className={inputClass} style={inputStyle} value={form.email} onChange={set("email")} required /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Phone number" required><input className={inputClass} style={inputStyle} value={form.phone} onChange={set("phone")} required /></Field>
          <Field label="WhatsApp number" required><input className={inputClass} style={inputStyle} value={form.whatsapp} onChange={set("whatsapp")} required /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Country" required><input className={inputClass} style={inputStyle} value={form.country} onChange={set("country")} required /></Field>
          <Field label="State / Province"><input className={inputClass} style={inputStyle} value={form.state} onChange={set("state")} /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Age" required><input type="number" min="10" max="100" className={inputClass} style={inputStyle} value={form.age} onChange={set("age")} required /></Field>
          <Field label="Occupation"><input className={inputClass} style={inputStyle} value={form.occupation} onChange={set("occupation")} /></Field>
        </div>
        <Field label="Highest education level">
          <select className={inputClass} style={inputStyle} value={form.education} onChange={set("education")}>
            <option value="">Select one</option>
            <option>Secondary school</option>
            <option>Undergraduate (in progress)</option>
            <option>Bachelor's degree</option>
            <option>Master's degree or higher</option>
            <option>Vocational / technical training</option>
            <option>Other</option>
          </select>
        </Field>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Do you own a smartphone?" required>
            <select className={inputClass} style={inputStyle} value={form.ownsSmartphone} onChange={set("ownsSmartphone")}>
              <option>Yes</option><option>No</option>
            </select>
          </Field>
          <Field label="Do you own a laptop? (optional)">
            <select className={inputClass} style={inputStyle} value={form.ownsLaptop} onChange={set("ownsLaptop")}>
              <option>No</option><option>Yes</option>
            </select>
          </Field>
        </div>
        <Field label="Preferred learning track" required>
          <select className={inputClass} style={inputStyle} value={form.track} onChange={set("track")}>
            {TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <Field label="Why do you want to join?" required>
          <textarea rows={4} className={inputClass} style={inputStyle} value={form.reason} onChange={set("reason")} required />
        </Field>
        <Field label="How many hours can you dedicate each week?" required>
          <select className={inputClass} style={inputStyle} value={form.hours} onChange={set("hours")}>
            <option value="10-15">10–15 hours</option>
            <option value="16-25">16–25 hours</option>
            <option value="26+">26+ hours</option>
          </select>
        </Field>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="LinkedIn (optional)"><input className={inputClass} style={inputStyle} value={form.linkedin} onChange={set("linkedin")} /></Field>
          <Field label="GitHub (optional)"><input className={inputClass} style={inputStyle} value={form.github} onChange={set("github")} /></Field>
          <Field label="Portfolio (optional)"><input className={inputClass} style={inputStyle} value={form.portfolio} onChange={set("portfolio")} /></Field>
        </div>
        <Field label="Upload passport photo (optional)">
          <input type="file" accept="image/*" className={inputClass} style={inputStyle} />
          <p className="text-xs mt-1" style={{ color: C.slate }}>
            Photo storage is coming in a later update — this field is a placeholder for now.
          </p>
        </Field>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1" checked={form.agree} onChange={set("agree")} />
          <span className="text-sm" style={{ color: C.slate }}>
            I agree to the Terms &amp; Conditions and understand this is a training and building program, not paid employment.
          </span>
        </label>

        <ErrorNote>{error}</ErrorNote>

        <PrimaryButton type="submit" full disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </PrimaryButton>
      </form>
    </section>
  );
            }
