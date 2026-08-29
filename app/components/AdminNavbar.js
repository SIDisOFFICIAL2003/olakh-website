"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminNavbar() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <header className="border-b border-white/20 bg-[#150297] text-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">

        {/* LOGO */}

        <a href="/admin" className="block shrink-0">

          <img
            src="/olakh-logo-transparent.png"
            alt="The Olakh Collective"
            className="h-14 w-auto"
          />

        </a>


        {/* NAVIGATION */}

        <nav className="hidden items-center gap-6 text-sm md:flex">

          <a
            href="/admin"
            className="text-white/70 transition hover:text-white"
          >
            Dashboard
          </a>

          <a
            href="/admin/blogs"
            className="text-white/70 transition hover:text-white"
          >
            Blogs
          </a>

          <a
            href="/admin/screenings"
            className="text-white/70 transition hover:text-white"
          >
            Screenings
          </a>

          <a
            href="/admin/volunteers"
            className="text-white/70 transition hover:text-white"
          >
            Volunteers
          </a>

          <a
            href="/admin/collaborations"
            className="text-white/70 transition hover:text-white"
          >
            Collaborations
          </a>

        </nav>


        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="shrink-0 rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium transition hover:bg-white hover:text-[#150297]"
        >
          Log out
        </button>

      </div>

    </header>
  );
}