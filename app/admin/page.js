"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Mail, MessageCircle, Download, LogOut } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  C, PrimaryButton, GhostButton, ErrorNote, StatusBadge, inputClass, inputStyle,
} from "../../components/ui";
import { TRACKS, sbFetch, sbSignIn, fromDb } from "../../lib/supabase";

function toCSV(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
}
function downloadCSV(rows, filename) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function AdminLogin({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await sbSignIn(email, password);
      onSignedIn(data.access_token);
    } catch (err) {
      setError(err.message || "Sign-in failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-sm mx-auto px-5 py-24">
      <h2 className="aeb-display font-semibold text-2xl">Admin sign-in</h2>
      <p className="text-sm mt-2" style={{ color: C.slate }}>Sign in with the admin account created in Supabase Authentication.</p>
      <form onSubmit={handleLogin} className="mt-5 space-y-4">
        <input type="email" placeholder="Email" className={inputClass} style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className={inputClass} style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <ErrorNote>{error}</ErrorNote>
        <PrimaryButton type="submit" full disabled={loading}>{loading ? "Signing in..." : "Enter admin portal"}</PrimaryButton>
      </form>
    </section>
  );
}

export default function Admin() {
  const [token, setToken] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsError, setApplicantsError] = useState("");
  const [actionError, setActionError] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const refreshApplicants = async (t) => {
    setApplicantsError("");
    try {
      const rows = await sbFetch("/rest/v1/applicants?select=*&order=builder_number.asc", { token: t });
      setApplicants((rows || []).map(fromDb));
    } catch (err) {
      setApplicantsError(err.message || "Couldn't load applicants.");
    }
  };

  useEffect(() => { if (token) refreshApplicants(token); }, [token]);
  const refreshAnnouncements = async () => {
    try {
      const rows = await sbFetch("/rest/v1/announcements?select=*&order=created_at.desc");
      setAnnouncements(rows || []);
    } catch {}
  };
  useEffect(() => { refreshAnnouncements(); }, []);

  const postAnnouncement = async () => {
    setAnnError("");
    if (!annTitle || !annBody) {
      setAnnError("Please fill in both a title and a message.");
      return;
    }
    try {
      await sbFetch("/rest/v1/announcements", {
        method: "POST",
        token,
        body: { title: annTitle, body: annBody },
      });
      setAnnTitle("");
      setAnnBody("");
      await refreshAnnouncements();
    } catch (err) {
      setAnnError(err.message || "Couldn't post announcement.");
    }
  };

  const countries = useMemo(() => Array.from(new Set(applicants.map((a) => a.country).filter(Boolean))).sort(), [applicants]);
  const filtered = applicants.filter((a) =>
    (countryFilter === "all" || a.country === countryFilter) &&
    (trackFilter === "all" || a.track === trackFilter) &&
    (statusFilter === "all" || a.status === statusFilter)
  );
  const trackCounts = TRACKS.map((t) => ({
    name: t.name.length > 14 ? t.name.slice(0, 14) + "…" : t.name,
    count: applicants.filter((a) => a.track === t.id).length,
  }));

  const setStatus = async (applicant, status) => {
    setActionError("");
    try {
      await sbFetch(`/rest/v1/applicants?id=eq.${applicant.id}`, { method: "PATCH", token, body: { status } });
      await refreshApplicants(token);
    } catch (err) {
      setActionError(err.message || "Couldn't update this applicant.");
    }
  };

  if (!token) return <AdminLogin onSignedIn={setToken} />;

  return (
    <section className="max-w-6xl mx-auto px-5 py-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="aeb-display font-semibold text-3xl">Admin portal</h2>
        <GhostButton onClick={() => setToken(null)}><LogOut size={16} /> Sign out</GhostButton>
      </div>

      <ErrorNote>{applicantsError}</ErrorNote>
      <ErrorNote>{actionError}</ErrorNote>

      <div className="grid sm:grid-cols-3 gap-5 mt-8">
        <div className="rounded-2xl p-5 border" style={{ borderColor: C.line }}>
          <p className="aeb-mono text-xs" style={{ color: C.slate }}>TOTAL APPLICANTS</p>
          <p className="text-2xl font-semibold mt-1">{applicants.length}</p>
        </div>
        <div className="rounded-2xl p-5 border" style={{ borderColor: C.line }}>
          <p className="aeb-mono text-xs" style={{ color: C.slate }}>ACCEPTED</p>
          <p className="text-2xl font-semibold mt-1" style={{ color: C.good }}>{applicants.filter((a) => a.status === "accepted").length}</p>
        </div>
        <div className="rounded-2xl p-5 border" style={{ borderColor: C.line }}>
          <p className="aeb-mono text-xs" style={{ color: C.slate }}>PENDING REVIEW</p>
          <p className="text-2xl font-semibold mt-1" style={{ color: C.blue }}>{applicants.filter((a) => a.status === "pending").length}</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border p-5" style={{ borderColor: C.line }}>
        <p className="aeb-mono text-xs mb-3" style={{ color: C.slate }}>APPLICANTS BY TRACK</p>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={trackCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={70} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={C.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center mt-10">
        <select className={inputClass} style={{ ...inputStyle, width: "auto" }} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
          <option value="all">All countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={inputClass} style={{ ...inputStyle, width: "auto" }} value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)}>
          <option value="all">All tracks</option>
          {TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select className={inputClass} style={{ ...inputStyle, width: "auto" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="ml-auto"><GhostButton onClick={() => downloadCSV(filtered, "applicants.csv")}><Download size={16} /> Export CSV</GhostButton></div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border" style={{ borderColor: C.line }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: C.mist }}>
              {["#", "Name", "Country", "Track", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center" style={{ color: C.slate }}>No applicants match these filters.</td></tr>
            )}
            {filtered.map((a) => {
              const track = TRACKS.find((t) => t.id === a.track);
              return (
                <tr key={a.id} className="border-t" style={{ borderColor: C.line }}>
                  <td className="px-4 py-3 aeb-mono">#{String(a.builderNumber).padStart(3, "0")}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{a.fullName}</p>
                    <p className="text-xs" style={{ color: C.slate }}>{a.email}</p>
                  </td>
                  <td className="px-4 py-3">{a.country}</td>
                  <td className="px-4 py-3">{track?.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setStatus(a, "accepted")} className="aeb-focus text-xs px-2.5 py-1.5 rounded-full border" style={{ borderColor: C.good, color: C.good }}>Accept</button>
                      <button onClick={() => setStatus(a, "rejected")} className="aeb-focus text-xs px-2.5 py-1.5 rounded-full border" style={{ borderColor: C.bad, color: C.bad }}>Reject</button>
                      <a href={`mailto:${a.email}`} className="aeb-focus text-xs px-2.5 py-1.5 rounded-full border inline-flex items-center gap-1" style={{ borderColor: C.line }}><Mail size={12} /> Email</a>
                      <a href={`https://wa.me/${a.whatsapp?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="aeb-focus text-xs px-2.5 py-1.5 rounded-full border inline-flex items-center gap-1" style={{ borderColor: C.line }}><MessageCircle size={12} /> WhatsApp</a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-4" style={{ color: C.slate }}>
        Email and WhatsApp buttons open your own mail/WhatsApp app with the applicant pre-filled — sending isn't automated yet.
      </p>
    </section>
  );
  }
