"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminNavbar from "../../../components/AdminNavbar";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // =====================================================
  // BLOG FIELDS
  // =====================================================

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState(null);

  // =====================================================
  // COVER IMAGE
  // =====================================================

  const [existingCover, setExistingCover] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  // =====================================================
  // CONTENT IMAGE 1
  // =====================================================

  const [existingContentImage1, setExistingContentImage1] =
    useState("");

  const [contentImage1File, setContentImage1File] =
    useState(null);

  const [contentImage1Preview, setContentImage1Preview] =
    useState("");

  const [contentImage1Title, setContentImage1Title] =
    useState("");

  const [removeContentImage1, setRemoveContentImage1] =
    useState(false);

  // =====================================================
  // CONTENT IMAGE 2
  // =====================================================

  const [existingContentImage2, setExistingContentImage2] =
    useState("");

  const [contentImage2File, setContentImage2File] =
    useState(null);

  const [contentImage2Preview, setContentImage2Preview] =
    useState("");

  const [contentImage2Title, setContentImage2Title] =
    useState("");

  const [removeContentImage2, setRemoveContentImage2] =
    useState(false);

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    if (id) {
      checkAdminAndLoadBlog();
    }
  }, [id]);

  // =====================================================
  // AUTH
  // =====================================================

  async function checkAdminAndLoadBlog() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    await loadBlog();
  }

  // =====================================================
  // LOAD BLOG
  // =====================================================

  async function loadBlog() {
    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !data) {
      console.error(fetchError);

      setError("Could not load this blog post.");
      setLoading(false);

      return;
    }

    setTitle(data.title || "");
    setSlug(data.slug || "");
    setCategory(data.category || "");
    setExcerpt(data.excerpt || "");
    setContent(data.content || "");

    setPublished(data.published || false);
    setPublishedAt(data.published_at || null);

    setExistingCover(data.cover_image || "");

    // Content images
    setExistingContentImage1(data.content_image_1 || "");
    setContentImage1Title(data.content_image_1_title || "");

    setExistingContentImage2(data.content_image_2 || "");
    setContentImage2Title(data.content_image_2_title || "");

    setLoading(false);
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

  // =====================================================
  // COVER IMAGE CHANGE
  // =====================================================

  function handleCoverImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverFile(file);

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  }

  // =====================================================
  // CONTENT IMAGE 1 CHANGE
  // =====================================================

  function handleContentImage1Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setContentImage1File(file);
    setRemoveContentImage1(false);

    const previewUrl = URL.createObjectURL(file);
    setContentImage1Preview(previewUrl);
  }

  // =====================================================
  // CONTENT IMAGE 2 CHANGE
  // =====================================================

  function handleContentImage2Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setContentImage2File(file);
    setRemoveContentImage2(false);

    const previewUrl = URL.createObjectURL(file);
    setContentImage2Preview(previewUrl);
  }

  // =====================================================
  // GENERIC IMAGE UPLOAD
  // =====================================================

  async function uploadImage(file, label) {
    if (!file) return null;

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
  // SAVE CHANGES
  // =====================================================

  async function saveChanges(action) {
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
      // COVER IMAGE
      // =================================================

      let coverImageUrl = existingCover || null;

      if (coverFile) {
        coverImageUrl = await uploadImage(
          coverFile,
          "cover"
        );
      }

      // =================================================
      // CONTENT IMAGE 1
      // =================================================

      let contentImage1Url =
        existingContentImage1 || null;

      if (removeContentImage1) {
        contentImage1Url = null;
      }

      if (contentImage1File) {
        contentImage1Url = await uploadImage(
          contentImage1File,
          "content-1"
        );
      }

      // =================================================
      // CONTENT IMAGE 2
      // =================================================

      let contentImage2Url =
        existingContentImage2 || null;

      if (removeContentImage2) {
        contentImage2Url = null;
      }

      if (contentImage2File) {
        contentImage2Url = await uploadImage(
          contentImage2File,
          "content-2"
        );
      }

      // =================================================
      // PUBLICATION STATE
      // =================================================

      let newPublished = published;
      let newPublishedAt = publishedAt;

      if (action === "publish") {
        newPublished = true;

        if (!newPublishedAt) {
          newPublishedAt = new Date().toISOString();
        }
      }

      if (action === "unpublish") {
        newPublished = false;
      }

      if (action === "draft") {
        newPublished = false;
      }

      // =================================================
      // UPDATE DATABASE
      // =================================================

      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
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
            contentImage1Url
              ? contentImage1Title.trim() || null
              : null,

          content_image_2:
            contentImage2Url,

          content_image_2_title:
            contentImage2Url
              ? contentImage2Title.trim() || null
              : null,

          published:
            newPublished,

          published_at:
            newPublishedAt,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while updating the blog."
      );

      setSaving(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F6FB] text-[#150297]">

        <p className="text-lg font-semibold">
          Loading article...
        </p>

      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#F7F6FB] text-[#150297]">

      <AdminNavbar />


      <section className="mx-auto max-w-5xl px-6 py-16">


        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#311EB2]">
              Olakh Journal
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              Edit article
            </h1>

          </div>


          <div
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
              published
                ? "bg-green-100 text-green-700"
                : "bg-[#FC65C3]/20 text-[#6C0666]"
            }`}
          >
            {published ? "Published" : "Draft"}
          </div>

        </div>


        {/* =================================================
            FORM
        ================================================== */}

        <div className="mt-12 rounded-3xl bg-white p-7 shadow-[0_15px_50px_rgba(21,2,151,0.08)] md:p-10">


          {/* TITLE */}

          <div>

            <label className="text-sm font-bold">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3.5 text-lg outline-none focus:border-[#311EB2]"
            />

          </div>


          {/* SLUG */}

          <div className="mt-6">

            <label className="text-sm font-bold">
              Slug
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(createSlug(e.target.value))
              }
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
            />

            <p className="mt-2 text-xs text-[#888]">
              URL: /blog/{slug}
            </p>

          </div>


          {/* CATEGORY */}

          <div className="mt-6">

            <label className="text-sm font-bold">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
            />

          </div>


          {/* EXCERPT */}

          <div className="mt-6">

            <label className="text-sm font-bold">
              Short excerpt
            </label>

            <textarea
              value={excerpt}
              onChange={(e) =>
                setExcerpt(e.target.value)
              }
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
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


            {(coverPreview || existingCover) && (

              <div className="mt-3 overflow-hidden rounded-2xl">

                <img
                  src={coverPreview || existingCover}
                  alt="Blog cover"
                  className="aspect-[16/9] w-full object-cover"
                />

              </div>

            )}


            <label className="mt-4 inline-flex cursor-pointer rounded-full border border-[#150297]/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-[#150297] hover:text-white">

              {coverPreview || existingCover
                ? "Replace cover image"
                : "Upload cover image"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCoverImageChange}
                className="hidden"
              />

            </label>

          </div>


          {/* =================================================
              ARTICLE CONTENT
          ================================================== */}

          <div className="mt-8">

            <label className="text-sm font-bold">
              Article content
            </label>

            <p className="mt-1 text-xs leading-5 text-[#888]">
              Separate paragraphs with a blank line. Paragraph
              breaks will be preserved on the published article.
            </p>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              rows={20}
              className="mt-3 w-full resize-y rounded-2xl border border-[#150297]/15 px-5 py-4 text-lg leading-8 outline-none focus:border-[#311EB2]"
            />

          </div>


          {/* =================================================
              ARTICLE IMAGES INTRO
          ================================================== */}

          <div className="mt-10 border-t border-[#150297]/10 pt-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#311EB2]">
              Article images
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Images inside the article
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
              These images are optional. You can replace them,
              remove them or update their captions.
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


            {!removeContentImage1 &&
              (contentImage1Preview ||
                existingContentImage1) && (

                <div className="mt-4">

                  <div className="overflow-hidden rounded-2xl">

                    <img
                      src={
                        contentImage1Preview ||
                        existingContentImage1
                      }
                      alt={
                        contentImage1Title ||
                        "Article content image 1"
                      }
                      className="aspect-[16/9] w-full object-cover"
                    />

                  </div>


                  <button
                    type="button"
                    onClick={() => {
                      setContentImage1File(null);
                      setContentImage1Preview("");
                      setExistingContentImage1("");
                      setRemoveContentImage1(true);
                    }}
                    className="mt-3 text-sm font-semibold text-red-600 transition hover:text-red-800"
                  >
                    Remove image
                  </button>

                </div>

              )}


            {removeContentImage1 ||
            (!contentImage1Preview &&
              !existingContentImage1) ? (

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/15 bg-white px-6 py-10 text-center transition hover:border-[#311EB2]">

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

            ) : (

              <label className="mt-4 inline-flex cursor-pointer rounded-full border border-[#150297]/20 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-[#150297] hover:text-white">

                Replace image

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleContentImage1Change}
                  className="hidden"
                />

              </label>

            )}


            <div className="mt-5">

              <label className="text-sm font-bold">
                Image title / caption
              </label>

              <input
                type="text"
                value={contentImage1Title}
                onChange={(e) =>
                  setContentImage1Title(
                    e.target.value
                  )
                }
                placeholder="Example: Participants during the post-screening discussion"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
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


            {!removeContentImage2 &&
              (contentImage2Preview ||
                existingContentImage2) && (

                <div className="mt-4">

                  <div className="overflow-hidden rounded-2xl">

                    <img
                      src={
                        contentImage2Preview ||
                        existingContentImage2
                      }
                      alt={
                        contentImage2Title ||
                        "Article content image 2"
                      }
                      className="aspect-[16/9] w-full object-cover"
                    />

                  </div>


                  <button
                    type="button"
                    onClick={() => {
                      setContentImage2File(null);
                      setContentImage2Preview("");
                      setExistingContentImage2("");
                      setRemoveContentImage2(true);
                    }}
                    className="mt-3 text-sm font-semibold text-red-600 transition hover:text-red-800"
                  >
                    Remove image
                  </button>

                </div>

              )}


            {removeContentImage2 ||
            (!contentImage2Preview &&
              !existingContentImage2) ? (

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/15 bg-white px-6 py-10 text-center transition hover:border-[#311EB2]">

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

            ) : (

              <label className="mt-4 inline-flex cursor-pointer rounded-full border border-[#150297]/20 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-[#150297] hover:text-white">

                Replace image

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleContentImage2Change}
                  className="hidden"
                />

              </label>

            )}


            <div className="mt-5">

              <label className="text-sm font-bold">
                Image title / caption
              </label>

              <input
                type="text"
                value={contentImage2Title}
                onChange={(e) =>
                  setContentImage2Title(
                    e.target.value
                  )
                }
                placeholder="Example: Community reflections after the film"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
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

          <div className="mt-10 flex flex-wrap justify-end gap-3 border-t border-[#150297]/10 pt-8">

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                saveChanges(
                  published ? "save" : "draft"
                )
              }
              className="rounded-full border border-[#150297]/20 px-6 py-3 font-semibold transition hover:border-[#150297] disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>


            {!published ? (

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveChanges("publish")
                }
                className="rounded-full bg-[#FC65C3] px-7 py-3 font-bold text-[#150297] transition hover:bg-[#150297] hover:text-white disabled:opacity-50"
              >
                Publish
              </button>

            ) : (

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveChanges("unpublish")
                }
                className="rounded-full bg-[#150297] px-7 py-3 font-bold text-white transition hover:bg-[#311EB2] disabled:opacity-50"
              >
                Unpublish
              </button>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}