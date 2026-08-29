"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#150297] text-white">

      {/* =========================
          HEADER
      ========================== */}

      <AdminNavbar />


      {/* =========================
          DASHBOARD
      ========================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FC65C3]">
            Olakh Admin
          </p>


          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
            Dashboard
          </h1>


          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Manage Olakh&apos;s blogs, screenings, volunteers and
            community content from one place.
          </p>

        </div>


        {/* =========================
            MANAGEMENT CARDS
        ========================== */}

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">


          {/* =========================
              BLOGS
          ========================== */}

          <a
            href="/admin/blogs"
            className="group rounded-2xl bg-white p-8 text-[#150297] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1"
          >

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#311EB2]">
              Content
            </p>


            <h2 className="mt-4 text-3xl font-bold">
              Blogs
            </h2>


            <p className="mt-4 leading-7 text-[#555]">
              Write, edit and publish stories from the Olakh
              collective.
            </p>


            <p className="mt-8 font-semibold text-[#311EB2]">
              Manage blogs →
            </p>

          </a>


          {/* =========================
              SCREENINGS
          ========================== */}

          <a
            href="/admin/screenings"
            className="group rounded-2xl bg-[#311EB2] p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1"
          >

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
              Events
            </p>


            <h2 className="mt-4 text-3xl font-bold">
              Screenings
            </h2>


            <p className="mt-4 leading-7 text-white/80">
              Add upcoming screenings and document previous ones.
            </p>


            <p className="mt-8 font-semibold">
              Manage screenings →
            </p>

          </a>


          {/* =========================
              VOLUNTEERS
          ========================== */}

          <a
            href="/admin/volunteers"
            className="group rounded-2xl bg-[#FC65C3] p-8 text-[#150297] shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1"
          >

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6C0666]">
              Community
            </p>


            <h2 className="mt-4 text-3xl font-bold">
              Volunteers
            </h2>


            <p className="mt-4 leading-7 text-[#150297]/75">
              Review volunteer applications, contact people and
              manage their status.
            </p>


            <p className="mt-8 font-semibold text-[#6C0666]">
              Manage volunteers →
            </p>

          </a>
          {/* =========================
              COLLABORATIONS
          ========================== */}

          <a
            href="/admin/collaborations"
            className="group rounded-2xl bg-white p-8 text-[#150297] shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1"
          >

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#311EB2]">
              Partnerships
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              Collaborations
            </h2>

            <p className="mt-4 leading-7 text-[#555]">
              Review partnership proposals and manage collaboration conversations.
            </p>

            <p className="mt-8 font-semibold text-[#311EB2]">
              Manage collaborations →
            </p>

          </a>


          {/* =========================
              IMPACT
          ========================== */}

          <div className="rounded-2xl border border-white/20 p-8">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Impact
            </p>


            <h2 className="mt-4 text-3xl font-bold">
              Coming soon
            </h2>


            <p className="mt-4 leading-7 text-white/70">
              Track participant responses, relatability and the
              impact of Olakh&apos;s screenings.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}