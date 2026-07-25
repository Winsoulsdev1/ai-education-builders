import {
  Sparkles, Bot, ClipboardList, Palette, Code2, Smartphone, Cloud, Shield,
  BarChart3, Megaphone, FileText, Handshake,
} from "lucide-react";

// These are PUBLIC, safe-to-expose keys (protected by Row Level Security
// policies in the database) — not secrets. Never put your service_role key
// or database password here.
export const SUPABASE_URL = "https://vjnkkolguybznwsspqox.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_LfX2wyXIxkKPt9bitx_6LA_I2-ffpVT";

export async function sbFetch(path, { method = "GET", body, token, prefer } = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers["Prefer"] = prefer;
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      msg = j.message || j.error_description || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text);
}
}

export async function sbSignIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Sign-in failed");
  return data;
}

export const TOTAL_SEATS = 100;

export const TRACKS = [
  { id: "prompt-engineering", name: "AI Prompt Engineering", icon: Sparkles, blurb: "Direct AI models to produce real, reliable work." },
  { id: "ai-automation", name: "AI Automation", icon: Bot, blurb: "Chain tools and models into systems that run themselves." },
  { id: "product-management", name: "Product Management", icon: ClipboardList, blurb: "Turn a problem into a product people actually use." },
  { id: "ui-ux-design", name: "UI/UX Design", icon: Palette, blurb: "Design interfaces learners can pick up in seconds." },
  { id: "full-stack", name: "Full Stack Development", icon: Code2, blurb: "Build the apps that carry all of the above." },
  { id: "mobile-dev", name: "Mobile App Development", icon: Smartphone, blurb: "Ship for the device most Africans already carry." },
  { id: "cloud-devops", name: "Cloud & DevOps", icon: Cloud, blurb: "Keep what you build running, at scale, without drama." },
  { id: "cybersecurity", name: "Cybersecurity", icon: Shield, blurb: "Protect learner data and public trust in what we build." },
  { id: "data-science", name: "Data Science", icon: BarChart3, blurb: "Find out what's actually working, in the numbers." },
  { id: "digital-marketing", name: "Digital Marketing", icon: Megaphone, blurb: "Get world-class tools in front of the people who need them." },
  { id: "technical-writing", name: "Technical Writing", icon: FileText, blurb: "Make complex ideas plain enough to teach with." },
  { id: "sales-partnerships", name: "Sales & Partnerships", icon: Handshake, blurb: "Bring schools, sponsors and allies into the mission." },
];

export const CHECKLIST = [
  "Complete your builder profile",
  "Join your track's community channel",
  "Attend orientation call",
  "Finish week 1 foundations module",
  "Submit your first practical project",
];

export const ANNOUNCEMENTS = [
  { title: "Cohort 1 orientation date confirmed", body: "All accepted builders will receive a calendar invite and WhatsApp reminder before orientation." },
  { title: "Mentors are being matched to tracks", body: "You'll be introduced to your track mentor once your application is accepted." },
];

export function fromDb(row) {
  return {
    id: row.id,
    builderNumber: row.builder_number,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    country: row.country,
    state: row.state,
    age: row.age,
    occupation: row.occupation,
    education: row.education,
    ownsSmartphone: row.owns_smartphone ? "Yes" : "No",
    ownsLaptop: row.owns_laptop ? "Yes" : "No",
    track: row.track_id,
    reason: row.reason,
    hours: row.hours_per_week,
    linkedin: row.linkedin,
    github: row.github,
    portfolio: row.portfolio,
    status: row.status,
    submittedAt: row.created_at,
  };
}

export function toDb(form) {
  return {
    full_name: form.fullName,
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp,
    country: form.country,
    state: form.state,
    age: form.age ? parseInt(form.age, 10) : null,
    occupation: form.occupation,
    education: form.education,
    owns_smartphone: form.ownsSmartphone === "Yes",
    owns_laptop: form.ownsLaptop === "Yes",
    track_id: form.track,
    reason: form.reason,
    hours_per_week: form.hours,
    linkedin: form.linkedin,
    github: form.github,
    portfolio: form.portfolio,
  };
}
