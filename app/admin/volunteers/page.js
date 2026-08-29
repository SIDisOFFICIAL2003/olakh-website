"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AdminNavbar from "../../components/AdminNavbar";
export default function AdminVolunteersPage() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    await loadSubmissions();
  }

  async function loadSubmissions() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("volunteer_submissions")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (fetchError) {
      console.error(fetchError);

      setError("Could not load volunteer submissions.");
      setLoading(false);

      return;
    }

    setSubmissions(data || []);
    setLoading(false);
  }

  async function changeStatus(id, status) {
    setUpdatingId(id);

    const { error: updateError } = await supabase
      .from("volunteer_submissions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      alert("Could not update status.");
      setUpdatingId(null);
      return;
    }

    setSubmissions((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    setUpdatingId(null);
  }

  async function deleteSubmission(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this volunteer submission?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error: deleteError } = await supabase
      .from("volunteer_submissions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      alert("Could not delete submission.");
      setDeletingId(null);
      return;
    }

    setSubmissions((current) =>
      current.filter((item) => item.id !== id)
    );

    setDeletingId(null);
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status) {
    switch (status) {
      case "contacted":
        return "bg-blue-50 text-blue-700";

      case "accepted":
        return "bg-green-50 text-green-700";

      case "closed":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-[#FC65C3]/20 text-[#6C0666]";
    }
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      submission.name?.toLowerCase().includes(query) ||
      submission.email?.toLowerCase().includes(query) ||
      submission.phone?.toLowerCase().includes(query) ||
      submission.city?.toLowerCase().includes(query) ||
      submission.interests?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-[#F7F6FB] text-[#150297]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <AdminNavbar />


      {/* =====================================================
          PAGE
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#311EB2]">
              Community
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              Volunteers
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#666]">
              Review volunteer applications, contact applicants
              and track their status.
            </p>

          </div>


          <div className="rounded-2xl bg-white px-6 py-4 shadow-sm">

            <p className="text-xs uppercase tracking-[0.16em] text-[#999]">
              Total submissions
            </p>

            <p className="mt-1 text-3xl font-bold text-[#150297]">
              {submissions.length}
            </p>

          </div>

        </div>


        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mt-12 rounded-2xl bg-white p-5 shadow-[0_10px_35px_rgba(21,2,151,0.05)]">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, city or interest..."
            className="w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none transition focus:border-[#311EB2]"
          />

        </div>


        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (

          <div className="mt-8 rounded-2xl bg-white p-12 text-center text-[#666]">
            Loading volunteer submissions...
          </div>

        )}


        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loading && error && (

          <div className="mt-8 rounded-2xl bg-red-50 p-6 text-red-700">
            {error}
          </div>

        )}


        {/* =====================================================
            EMPTY
        ====================================================== */}

        {!loading &&
          !error &&
          filteredSubmissions.length === 0 && (

            <div className="mt-8 rounded-2xl border border-dashed border-[#150297]/15 bg-white p-12 text-center">

              <p className="text-[#666]">
                No volunteer submissions found.
              </p>

            </div>

          )}


        {/* =====================================================
            TABLE
        ====================================================== */}

        {!loading &&
          !error &&
          filteredSubmissions.length > 0 && (

            <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(21,2,151,0.06)]">

              <div className="overflow-x-auto">

                <table className="min-w-[1200px] w-full border-collapse">

                  {/* HEADER */}

                  <thead className="bg-[#150297] text-left text-white">

                    <tr>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Name
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        City
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Interest
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Availability
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Message
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Submitted
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em]">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  {/* BODY */}

                  <tbody>

                    {filteredSubmissions.map(
                      (submission, index) => (

                        <tr
                          key={submission.id}
                          className={`border-b border-[#150297]/8 transition hover:bg-[#F7F6FB] ${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-[#FBFAFD]"
                          }`}
                        >


                          {/* NAME */}

                          <td className="px-5 py-5 align-top">

                            <p className="font-bold text-[#150297]">
                              {submission.name}
                            </p>

                          </td>


                          {/* CONTACT */}

                          <td className="px-5 py-5 align-top">

                            <a
                              href={`mailto:${submission.email}`}
                              className="block text-sm font-medium text-[#311EB2] hover:underline"
                            >
                              {submission.email}
                            </a>

                            <p className="mt-1 text-sm text-[#777]">
                              {submission.phone || "No phone"}
                            </p>

                          </td>


                          {/* CITY */}

                          <td className="px-5 py-5 align-top text-sm text-[#555]">

                            {submission.city || "—"}

                          </td>


                          {/* INTEREST */}

                          <td className="px-5 py-5 align-top">

                            <span className="inline-flex rounded-full bg-[#311EB2]/8 px-3 py-1.5 text-xs font-semibold text-[#311EB2]">

                              {submission.interests || "Not specified"}

                            </span>

                          </td>


                          {/* AVAILABILITY */}

                          <td className="px-5 py-5 align-top text-sm text-[#555]">

                            {submission.availability || "—"}

                          </td>


                          {/* MESSAGE */}

                          <td className="max-w-[240px] px-5 py-5 align-top">

                            <p
                              className="line-clamp-3 text-sm leading-6 text-[#666]"
                              title={submission.message || ""}
                            >
                              {submission.message || "—"}
                            </p>

                          </td>


                          {/* DATE */}

                          <td className="px-5 py-5 align-top text-sm text-[#777]">

                            {formatDate(
                              submission.created_at
                            )}

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-5 align-top">

                            <div className="space-y-2">

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getStatusClass(
                                  submission.status
                                )}`}
                              >
                                {submission.status || "new"}
                              </span>


                              <select
                                value={
                                  submission.status || "new"
                                }
                                disabled={
                                  updatingId === submission.id
                                }
                                onChange={(e) =>
                                  changeStatus(
                                    submission.id,
                                    e.target.value
                                  )
                                }
                                className="block rounded-lg border border-[#150297]/15 bg-white px-3 py-2 text-xs font-semibold outline-none"
                              >

                                <option value="new">
                                  New
                                </option>

                                <option value="contacted">
                                  Contacted
                                </option>

                                <option value="accepted">
                                  Accepted
                                </option>

                                <option value="closed">
                                  Closed
                                </option>

                              </select>

                            </div>

                          </td>


                          {/* ACTIONS */}

                          <td className="px-5 py-5 align-top">

                            <div className="flex flex-col gap-2">

                              <a
                                href={`mailto:${submission.email}`}
                                className="rounded-full bg-[#150297] px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#311EB2]"
                              >
                                Email
                              </a>


                              {submission.phone && (

                                <a
                                  href={`tel:${submission.phone}`}
                                  className="rounded-full border border-[#150297]/20 px-4 py-2 text-center text-xs font-semibold text-[#150297] transition hover:bg-[#F7F6FB]"
                                >
                                  Call
                                </a>

                              )}


                              <button
                                onClick={() =>
                                  deleteSubmission(
                                    submission.id
                                  )
                                }
                                disabled={
                                  deletingId === submission.id
                                }
                                className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                {deletingId === submission.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

      </section>

    </main>
  );
}