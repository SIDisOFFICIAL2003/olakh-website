"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AdminNavbar from "../../components/AdminNavbar";
export default function AdminScreeningsPage() {
  const router = useRouter();

  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminAndLoadScreenings();
  }, []);

  async function checkAdminAndLoadScreenings() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    await fetchScreenings();
  }

  async function fetchScreenings() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("screenings")
      .select("*")
      .order("screening_date", { ascending: false });

    if (error) {
      console.error("Error fetching screenings:", error);
      setError("Could not load screenings.");
      setLoading(false);
      return;
    }

    setScreenings(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this screening?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("screenings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete the screening.");
      setDeletingId(null);
      return;
    }

    setScreenings((current) =>
      current.filter((screening) => screening.id !== id)
    );

    setDeletingId(null);
  }

  function formatDate(date) {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function isUpcoming(date) {
    if (!date) return false;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const screeningDate = new Date(`${date}T00:00:00`);

    return screeningDate >= today;
  }

  const publishedScreenings = screenings.filter(
    (screening) => screening.published
  );

  const upcomingScreenings = publishedScreenings
    .filter((screening) => isUpcoming(screening.screening_date))
    .sort(
      (a, b) =>
        new Date(a.screening_date) - new Date(b.screening_date)
    );

  const previousScreenings = publishedScreenings
    .filter((screening) => !isUpcoming(screening.screening_date))
    .sort(
      (a, b) =>
        new Date(b.screening_date) - new Date(a.screening_date)
    );

  const draftScreenings = screenings.filter(
    (screening) => !screening.published
  );

  function ScreeningCard({ screening }) {
    const upcoming = isUpcoming(screening.screening_date);

    return (
      <article className="group grid gap-6 rounded-2xl bg-white p-5 shadow-[0_10px_35px_rgba(21,2,151,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(21,2,151,0.12)] md:grid-cols-[150px_1fr_auto] md:items-center">

        {/* IMAGE */}

        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#EFEAFB]">

          {screening.cover_image ? (
            <img
              src={screening.cover_image}
              alt={screening.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                backgroundImage: "url('/olakh-pattern.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

        </div>


        {/* INFORMATION */}

        <div>

          <div className="flex flex-wrap gap-2">

            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                screening.published
                  ? "bg-green-100 text-green-700"
                  : "bg-[#FC65C3]/20 text-[#6C0666]"
              }`}
            >
              {screening.published ? "Published" : "Draft"}
            </span>

            {screening.published && (
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  upcoming
                    ? "bg-[#311EB2]/10 text-[#311EB2]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {upcoming ? "Upcoming" : "Previous"}
              </span>
            )}

          </div>


          <h2 className="mt-3 text-2xl font-bold leading-tight text-[#150297]">
            {screening.title}
          </h2>


          {/* DATE / TIME */}

          <div className="mt-3 flex flex-wrap gap-x-2 text-sm font-medium text-[#555]">

            <span>
              {formatDate(screening.screening_date)}
            </span>

            {screening.screening_time && (
              <>
                <span>·</span>

                <span>
                  {formatTime(screening.screening_time)}
                </span>
              </>
            )}

          </div>


          {/* LOCATION */}

          {(screening.venue || screening.city) && (
            <p className="mt-2 text-sm text-[#777]">
              {[screening.venue, screening.city]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}


          {/* DESCRIPTION */}

          {screening.short_description && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#777]">
              {screening.short_description}
            </p>
          )}

        </div>


        {/* ACTIONS */}

        <div className="flex gap-3 md:flex-col">

          <a
            href={`/admin/screenings/${screening.id}`}
            className="rounded-full bg-[#150297] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#311EB2]"
          >
            Edit
          </a>

          <button
            onClick={() => handleDelete(screening.id)}
            disabled={deletingId === screening.id}
            className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {deletingId === screening.id
              ? "Deleting..."
              : "Delete"}
          </button>

        </div>

      </article>
    );
  }

  function ScreeningSection({
    label,
    title,
    screenings,
    emptyMessage,
  }) {
    return (
      <section className="mt-16">

        <div className="flex items-end justify-between border-b border-[#150297]/10 pb-5">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#311EB2]">
              {label}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {title}
            </h2>
          </div>

          <span className="text-sm font-semibold text-[#777]">
            {screenings.length}
          </span>

        </div>


        {screenings.length === 0 ? (

          <div className="mt-5 rounded-2xl border border-dashed border-[#150297]/15 bg-white px-8 py-10">

            <p className="text-[#777]">
              {emptyMessage}
            </p>

          </div>

        ) : (

          <div className="mt-5 space-y-4">

            {screenings.map((screening) => (
              <ScreeningCard
                key={screening.id}
                screening={screening}
              />
            ))}

          </div>

        )}

      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6FB] text-[#150297]">

      {/* ADMIN HEADER */}

      <AdminNavbar />


      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">

        {/* TITLE */}

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#311EB2]">
              Content Management
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              Screenings
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#666]">
              Manage upcoming screenings, previous screenings
              and screening stories.
            </p>

          </div>


          <a
            href="/admin/screenings/new"
            className="inline-flex items-center justify-center rounded-full bg-[#FC65C3] px-6 py-3.5 font-bold text-[#150297] transition hover:-translate-y-1 hover:bg-[#150297] hover:text-white"
          >
            + New Screening
          </a>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="mt-14 rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-[#666]">
              Loading screenings...
            </p>
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="mt-14 rounded-2xl bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}


        {/* SCREENING SECTIONS */}

        {!loading && !error && (
          <>

            <ScreeningSection
              label="Coming next"
              title="Upcoming screenings"
              screenings={upcomingScreenings}
              emptyMessage="There are no upcoming published screenings."
            />

            <ScreeningSection
              label="Archive"
              title="Previous screenings"
              screenings={previousScreenings}
              emptyMessage="There are no previous screenings yet."
            />

            <ScreeningSection
              label="Unpublished"
              title="Drafts"
              screenings={draftScreenings}
              emptyMessage="There are no screening drafts."
            />

          </>
        )}

      </div>

    </main>
  );
}