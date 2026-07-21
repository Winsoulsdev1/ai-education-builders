# AI Education Builders Program — website

This is a real Next.js website connected to your Supabase database.

## What's already done
- Database, tables, and security rules are live in Supabase
- This code is wired to talk to that database directly (the connection details
  in `lib/supabase.js` are safe, public keys — not secrets)

## Deploying (no coding required)
1. Create a free GitHub account at https://github.com if you don't have one
2. Create a new repository (keep it **Private** or **Public**, either works)
3. Upload every file in this folder to that repository (GitHub's web
   interface has an "Add file → Upload files" button that lets you drag
   files in without using any command line)
4. Go to https://vercel.com, sign up (use "Continue with GitHub")
5. Click **Add New → Project**, select the repository you just created
6. Click **Deploy** — no settings need to be changed
7. After a minute or two, Vercel gives you a live web address like
   `ai-education-builders.vercel.app` — that's your real, working site

## Later
- A custom domain (e.g. aieducationbuilders.africa) can be attached in
  Vercel's project settings under "Domains"
- Passport photo upload and automated email/WhatsApp are not wired up yet —
  those come in a later step
