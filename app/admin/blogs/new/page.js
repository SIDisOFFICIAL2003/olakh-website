"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminNavbar from "../../../components/AdminNavbar";

export default function NewBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  // =====================================================
  // COVER IMAGE
  // =====================================================

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  // =====================================================
  // CONTENT IMAGE 1
  // =====================================================

  const [contentImage1File, setContentImage1File] = useState(null);
  const [contentImage1Preview, setContentImage1Preview] = useState("");
  const [contentImage1Title, setContentImage1Title] = useState("");

  // =====================================================
  // CONTENT IMAGE 2
  // =====================================================

  const [contentImage2File, setContentImage2File] = useState(null);
  const [contentImage2Preview, setContentImage2Preview] = useState("");
  const [contentImage2Title, setContentImage2Title] = useState("");

  // =====================================================
  // UI STATE
  // =====================================================

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  // =====================================================
  // AUTH
  // =====================================================

  async function checkAdmin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
    }
  }

  // =====================================================
  // SLUG
  // =====================================================

  function createSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(e) {
    const value = e.target.value;

    setTitle(value);
    setSlug(createSlug(value));
  }

  // =====================================================
  // IMAGE PREVIEWS
  // =====================================================

  function handleCoverImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverFile(file);

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  }

  function handleContentImage1Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setContentImage1File(file);

    const previewUrl = URL.createObjectURL(file);
    setContentImage1Preview(previewUrl);
  }

  function handleContentImage2Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setContentImage2File(file);

    const previewUrl = URL.createObjectURL(file);
    setContentImage2Preview(previewUrl);
  }

  // =====================================================
  // GENERIC IMAGE UPLOAD
  // =====================================================

  async function uploadImage(file, label) {
    if (!file) {
      return null;
    }

    const fileExtension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeSlug = slug || "blog";

    const fileName =
      `${safeSlug}-${label}-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // =====================================================
  // SAVE BLOG
  // =====================================================

  async function saveBlog(publishNow) {
    setError("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a slug.");
      return;
    }

    if (!category.trim()) {
      setError("Please enter a category.");
      return;
    }

    if (!content.trim()) {
      setError("Please write the article content.");
      return;
    }

    setSaving(true);

    try {
      // =================================================
      // UPLOAD IMAGES
      // =================================================

      const coverImageUrl = coverFile
        ? await uploadImage(coverFile, "cover")
        : null;

      const contentImage1Url = contentImage1File
        ? await uploadImage(contentImage1File, "content-1")
        : null;

      const contentImage2Url = contentImage2File
        ? await uploadImage(contentImage2File, "content-2")
        : null;

      const now = new Date().toISOString();

      // =================================================
      // DATABASE DATA
      // =================================================

      const blogData = {
        title: title.trim(),
        slug: slug.trim(),
        category: category.trim(),

        excerpt:
          excerpt.trim() || null,

        content:
          content.trim(),

        cover_image:
          coverImageUrl,

        content_image_1:
          contentImage1Url,

        content_image_1_title:
          contentImage1Title.trim() || null,

        content_image_2:
          contentImage2Url,

        content_image_2_title:
          contentImage2Title.trim() || null,

        published:
          publishNow,

        published_at:
          publishNow
            ? now
            : null,

        updated_at:
          now,
      };

      // =================================================
      // INSERT
      // =================================================

      const { error: insertError } = await supabase
        .from("blog_posts")
        .insert(blogData);

      if (insertError) {
        throw insertError;
      }

      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while saving the blog."
      );

      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F6FB] text-[#150297]">

      {/* =====================================================
          ADMIN NAVBAR
      ====================================================== */}

      <AdminNavbar />


      {/* =====================================================
          PAGE
      ====================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">

        {/* =================================================
            INTRO
        ================================================== */}

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#311EB2]">
            Olakh Journal
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Create a new blog
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#666]">
            Write an article for the Olakh Journal. Add optional
            images within the article and publish when it&apos;s ready.
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================== */}

        <div className="mt-12 rounded-3xl bg-white p-7 shadow-[0_15px_50px_rgba(21,2,151,0.08)] md:p-10">


          {/* =================================================
              TITLE
          ================================================== */}

          <div>

            <label
              htmlFor="title"
              className="text-sm font-bold"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter blog title"
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3.5 text-lg outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
            />

          </div>


          {/* =================================================
              SLUG
          ================================================== */}

          <div className="mt-6">

            <label
              htmlFor="slug"
              className="text-sm font-bold"
            >
              Slug
            </label>

            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(createSlug(e.target.value))
              }
              placeholder="blog-url-slug"
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
            />

            <p className="mt-2 text-xs text-[#888]">
              URL: /blog/{slug || "your-blog-title"}
            </p>

          </div>


          {/* =================================================
              CATEGORY
          ================================================== */}

          <div className="mt-6">

            <label
              htmlFor="category"
              className="text-sm font-bold"
            >
              Category
            </label>

            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="Example: Cinema & Representation"
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
            />

          </div>


          {/* =================================================
              EXCERPT
          ================================================== */}

          <div className="mt-6">

            <label
              htmlFor="excerpt"
              className="text-sm font-bold"
            >
              Short excerpt
            </label>

            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) =>
                setExcerpt(e.target.value)
              }
              rows={3}
              placeholder="A short introduction that will appear on the blog card..."
              className="mt-2 w-full resize-none rounded-xl border border-[#150297]/15 px-4 py-3 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
            />

          </div>


          {/* =================================================
              COVER IMAGE
          ================================================== */}

          <div className="mt-8">

            <div className="flex items-center justify-between">

              <label className="text-sm font-bold">
                Cover image
              </label>

              <span className="text-xs text-[#888]">
                Optional
              </span>

            </div>


            <div className="mt-3">

              {coverPreview ? (

                <div className="relative overflow-hidden rounded-2xl">

                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="aspect-[16/9] w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview("");
                    }}
                    className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#150297] shadow"
                  >
                    Remove
                  </button>

                </div>

              ) : (

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/20 bg-[#F7F6FB] px-6 py-12 text-center transition hover:border-[#311EB2]">

                  <span className="text-3xl">
                    +
                  </span>

                  <span className="mt-2 font-semibold">
                    Upload cover image
                  </span>

                  <span className="mt-1 text-xs text-[#888]">
                    JPG, PNG or WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />

                </label>

              )}

            </div>

          </div>


          {/* =================================================
              ARTICLE CONTENT
          ================================================== */}

          <div className="mt-8">

            <label
              htmlFor="content"
              className="text-sm font-bold"
            >
              Article content
            </label>

            <p className="mt-1 text-xs leading-5 text-[#888]">
              Separate paragraphs with a blank line. Those paragraph
              breaks will be preserved on the published article.
            </p>

            <textarea
              id="content"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              rows={20}
              placeholder={`Start writing...

Leave a blank line between paragraphs.

For example:

Cinema shapes the way we understand ourselves and others.

When communities watch films together, new conversations become possible.`}
              className="mt-3 w-full resize-y rounded-2xl border border-[#150297]/15 px-5 py-4 text-lg leading-8 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
            />

          </div>


          {/* =================================================
              CONTENT IMAGES SECTION
          ================================================== */}

          <div className="mt-10 border-t border-[#150297]/10 pt-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#311EB2]">
              Article images
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Add images inside the article
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
              These are optional. On the published article, the images
              can be placed naturally between sections of your written
              content.
            </p>

          </div>


          {/* =================================================
              CONTENT IMAGE 1
          ================================================== */}

          <div className="mt-8 rounded-2xl border border-[#150297]/10 bg-[#FAF9FD] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-bold">
                  Content image 1
                </p>

                <p className="mt-1 text-xs text-[#888]">
                  Optional
                </p>

              </div>

              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#FC65C3]">
                Image 01
              </span>

            </div>


            <div className="mt-4">

              {contentImage1Preview ? (

                <div className="relative overflow-hidden rounded-2xl">

                  <img
                    src={contentImage1Preview}
                    alt="Content image 1 preview"
                    className="aspect-[16/9] w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setContentImage1File(null);
                      setContentImage1Preview("");
                    }}
                    className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#150297] shadow"
                  >
                    Remove
                  </button>

                </div>

              ) : (

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/15 bg-white px-6 py-10 text-center transition hover:border-[#311EB2]">

                  <span className="text-3xl">
                    +
                  </span>

                  <span className="mt-2 font-semibold">
                    Upload content image
                  </span>

                  <span className="mt-1 text-xs text-[#888]">
                    JPG, PNG or WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleContentImage1Change}
                    className="hidden"
                  />

                </label>

              )}

            </div>


            <div className="mt-5">

              <label
                htmlFor="contentImage1Title"
                className="text-sm font-bold"
              >
                Image title / caption
              </label>

              <input
                id="contentImage1Title"
                type="text"
                value={contentImage1Title}
                onChange={(e) =>
                  setContentImage1Title(e.target.value)
                }
                placeholder="Example: Participants during the post-screening discussion"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
              />

            </div>

          </div>


          {/* =================================================
              CONTENT IMAGE 2
          ================================================== */}

          <div className="mt-6 rounded-2xl border border-[#150297]/10 bg-[#FAF9FD] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-bold">
                  Content image 2
                </p>

                <p className="mt-1 text-xs text-[#888]">
                  Optional
                </p>

              </div>

              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#FC65C3]">
                Image 02
              </span>

            </div>


            <div className="mt-4">

              {contentImage2Preview ? (

                <div className="relative overflow-hidden rounded-2xl">

                  <img
                    src={contentImage2Preview}
                    alt="Content image 2 preview"
                    className="aspect-[16/9] w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setContentImage2File(null);
                      setContentImage2Preview("");
                    }}
                    className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#150297] shadow"
                  >
                    Remove
                  </button>

                </div>

              ) : (

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/15 bg-white px-6 py-10 text-center transition hover:border-[#311EB2]">

                  <span className="text-3xl">
                    +
                  </span>

                  <span className="mt-2 font-semibold">
                    Upload content image
                  </span>

                  <span className="mt-1 text-xs text-[#888]">
                    JPG, PNG or WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleContentImage2Change}
                    className="hidden"
                  />

                </label>

              )}

            </div>


            <div className="mt-5">

              <label
                htmlFor="contentImage2Title"
                className="text-sm font-bold"
              >
                Image title / caption
              </label>

              <input
                id="contentImage2Title"
                type="text"
                value={contentImage2Title}
                onChange={(e) =>
                  setContentImage2Title(e.target.value)
                }
                placeholder="Example: Community reflections after the film"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
              />

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>

          )}


          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="mt-10 flex flex-col gap-4 border-t border-[#150297]/10 pt-8 sm:flex-row sm:justify-end">

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                saveBlog(false)
              }
              className="rounded-full border border-[#150297]/20 px-7 py-3.5 font-semibold transition hover:border-[#150297] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Draft"}
            </button>


            <button
              type="button"
              disabled={saving}
              onClick={() =>
                saveBlog(true)
              }
              className="rounded-full bg-[#FC65C3] px-7 py-3.5 font-bold text-[#150297] transition hover:-translate-y-1 hover:bg-[#150297] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Publishing..."
                : "Publish"}
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}