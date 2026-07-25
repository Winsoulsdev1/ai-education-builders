"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { C, Pill, PrimaryButton, StatusBadge, ErrorNote, inputClass, inputStyle } from "../../components/ui";
import { TRACKS, CHECKLIST, sbFetch, sbSendCode, sbVerifyCode, WHATSAPP_GROUP_LINK } from "../../lib/supabase";

function DashboardLogin({ onFound }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sbSendCode(email);
      setStage("code");
    } catch (err) {
      setError(err.message || "Couldn't send code. Check your email address.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await sbVerifyCode(email, code);
      const rows = await sbFetch(`/rest/v1/applicants?select=*&email=eq.${encodeURIComponent(email)}`, {
        token: data.access_token,
      });
      if (!rows || !rows.length) {
        setError("No application found for this email.");
        return;
      }
      onFound(rows[0]);
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-sm mx-auto px-5 py-24">
      <h2 className="aeb-display font-semibold text-2xl">Access your dashboard</h2>
      <p className="text-sm mt-2" style={{ color: C.slate }}>
        {stage === "email"
          ? "Enter the email you applied with — we'll send a one-time code."
          : `Enter the 6-digit code sent to ${email}.`}
      </p>
      {stage === "email" ? (
        <form onSubmit={sendCode} className="mt-5 space-y-4">
          <input type="email" placeholder="Email" className={inputClass} style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <ErrorNote>{error}</ErrorNote>
          <PrimaryButton type="submit" full disabled={loading}>{loading ? "Sending..." : "Send code"}</PrimaryButton>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-5 space-y-4">
          <input type="text" inputMode="numeric" placeholder="6-digit code" className={inputClass} style={inputStyle} value={code} onChange={(e) => setCode(e.target.value)} required />
          <ErrorNote>{error}</ErrorNote>
          <PrimaryButton type="submit" full disabled={loading}>{loading ? "Checking..." : "Verify & continue"}</PrimaryButton>
        </form>
      )}
    </section>
  );
}

function fromDb(row) {
  return {
    id: row.id,
    builderNumber: row.builder_number,
    fullName: row.full_name,
    email: row.email,
    track: row.track_id,
    hours: row.hours_per_week,
    status: row.status,
  };
}

export default function Dashboard() {
  const [me, setMe] = useState(undefined);
  const [checked, setChecked] = useState({});
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("my-application");
      setMe(raw ? JSON.parse(raw) : null);
    } catch {
      setMe(null);
    }
    (async () => {
      try {
        const rows = await sbFetch("/rest/v1/announcements?select=*&order=created_at.desc");
        setAnnouncements(rows || []);
      } catch {}
    })();
  }, []);

  const handleFound = (row) => {
    const applicant = fromDb(row);
    try {
      localStorage.setItem("my-application", JSON.stringify(applicant));
    } catch {}
    setMe(applicant);
  };

  if (me === undefined) {
    return <div className="max-w-2xl mx-auto px-5 py-24 text-center" style={{ color: C.slate }}>Loading your dashboard…</div>;
  }
  if (!me) {
    return <DashboardLogin onFound={handleFound} />;
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
        <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer"
          className="aeb-focus mt-3 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium"
          style={{ background: C.blue, color: "#fff" }}>
          Join our WhatsApp group
        </a>
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
          {announcements.map((a) => (
            <div key={a.id} className="rounded-xl p-4 border" style={{ borderColor: C.line }}>
              <p className="font-medium text-sm">{a.title}</p>
              <p className="text-sm mt-1" style={{ color: C.slate }}>{a.body}</p>
            </div>
          ))}
          {announcements.length === 0 && <p className="text-sm" style={{ color: C.slate }}>No announcements yet.</p>}
        </div>
      </div>
    </section>
  );
    }
