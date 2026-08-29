"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminBlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    checkAdminAndLoadBlogs();
  }, []);

  async function checkAdminAndLoadBlogs() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    await fetchBlogs();
  }

  async function fetchBlogs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
      return;
    }

    setBlogs(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Could not delete the blog post.");
      console.error(error);
      setDeletingId(null);
      return;
    }

    setBlogs((currentBlogs) =>
      currentBlogs.filter((blog) => blog.id !== id)
    );

    setDeletingId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#F7F6FB] text-[#150297]">

      {/* HEADER */}

      <AdminNavbar />


      {/* PAGE CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#311EB2]">
              Content Management
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              Blogs
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#555]">
              Create, edit and publish articles for the Olakh Journal.
            </p>

          </div>

          <a
            href="/admin/blogs/new"
            className="inline-flex items-center justify-center rounded-full bg-[#FC65C3] px-6 py-3.5 font-bold text-[#150297] transition hover:-translate-y-1 hover:bg-[#150297] hover:text-white"
          >
            + New Blog
          </a>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="mt-14 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-[#666]">
              Loading blogs...
            </p>
          </div>
        )}


        {/* EMPTY STATE */}

        {!loading && blogs.length === 0 && (

          <div className="mt-14 rounded-2xl bg-white px-8 py-16 text-center shadow-[0_10px_40px_rgba(21,2,151,0.08)]">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#311EB2]">
              Olakh Journal
            </p>

            <h2 className="mt-4 text-3xl font-bold">
              No blog posts yet
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-[#666]">
              Create your first article and save it as a draft or publish
              it directly to the Olakh website.
            </p>

            <a
              href="/admin/blogs/new"
              className="mt-7 inline-flex rounded-full bg-[#150297] px-6 py-3 font-semibold text-white transition hover:bg-[#311EB2]"
            >
              Create first blog →
            </a>

          </div>

        )}


        {/* BLOG LIST */}

        {!loading && blogs.length > 0 && (

          <div className="mt-14 space-y-4">

            {blogs.map((blog) => (

              <article
                key={blog.id}
                className="group grid gap-6 rounded-2xl bg-white p-5 shadow-[0_10px_35px_rgba(21,2,151,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(21,2,151,0.12)] md:grid-cols-[120px_1fr_auto] md:items-center"
              >

                {/* COVER */}

                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#EFEAFB]">

                  {blog.cover_image ? (

                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-wider text-[#311EB2]/50">
                      No image
                    </div>

                  )}

                </div>


                {/* INFO */}

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                        blog.published
                          ? "bg-green-100 text-green-700"
                          : "bg-[#FC65C3]/20 text-[#6C0666]"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>

                    {blog.category && (
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#311EB2]">
                        {blog.category}
                      </span>
                    )}

                  </div>


                  <h2 className="mt-3 text-2xl font-bold leading-tight">
                    {blog.title}
                  </h2>


                  {blog.excerpt && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#666]">
                      {blog.excerpt}
                    </p>
                  )}


                  <p className="mt-3 text-xs text-[#999]">
                    Created{" "}
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>

                </div>


                {/* ACTIONS */}

                <div className="flex gap-3 md:flex-col">

                  <a
                    href={`/admin/blogs/${blog.id}`}
                    className="rounded-full bg-[#150297] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#311EB2]"
                  >
                    Edit
                  </a>

                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === blog.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}