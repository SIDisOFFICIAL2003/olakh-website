"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminNavbar from "../../../components/AdminNavbar";

export default function EditScreeningPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // =====================================================
  // SCREENING FIELDS
  // =====================================================

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullStory, setFullStory] = useState("");

  const [screeningDate, setScreeningDate] = useState("");
  const [screeningTime, setScreeningTime] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");

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
      checkAdminAndLoadScreening();
    }
  }, [id]);

  // =====================================================
  // AUTH
  // =====================================================

  async function checkAdminAndLoadScreening() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/admin/login");
      return;
    }

    await loadScreening();
  }

  // =====================================================
  // LOAD SCREENING
  // =====================================================

  async function loadScreening() {
    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from("screenings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !data) {
      console.error(fetchError);

      setError("Could not load this screening.");
      setLoading(false);
      return;
    }

    setTitle(data.title || "");
    setSlug(data.slug || "");
    setShortDescription(data.short_description || "");
    setFullStory(data.full_story || "");

    setScreeningDate(data.screening_date || "");
    setScreeningTime(data.screening_time || "");
    setVenue(data.venue || "");
    setCity(data.city || "");
    setRegistrationLink(data.registration_link || "");

    setPublished(data.published || false);
    setPublishedAt(data.published_at || null);

    // COVER
    setExistingCover(data.cover_image || "");

    // CONTENT IMAGE 1
    setExistingContentImage1(
      data.content_image_1 || ""
    );

    setContentImage1Title(
      data.content_image_1_title || ""
    );

    // CONTENT IMAGE 2
    setExistingContentImage2(
      data.content_image_2 || ""
    );

    setContentImage2Title(
      data.content_image_2_title || ""
    );

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
  // IMAGE VALIDATION
  // =====================================================

  function validateImage(file) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG or WEBP image."
      );
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "The image must be smaller than 5 MB."
      );
      return false;
    }

    setError("");
    return true;
  }

  // =====================================================
  // COVER IMAGE
  // =====================================================

  function handleCoverImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!validateImage(file)) return;

    setCoverFile(file);

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview(
      URL.createObjectURL(file)
    );
  }

  // =====================================================
  // CONTENT IMAGE 1
  // =====================================================

  function handleContentImage1Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!validateImage(file)) return;

    setContentImage1File(file);
    setRemoveContentImage1(false);

    if (contentImage1Preview) {
      URL.revokeObjectURL(
        contentImage1Preview
      );
    }

    setContentImage1Preview(
      URL.createObjectURL(file)
    );
  }

  function removeStoryImage1() {
    if (contentImage1Preview) {
      URL.revokeObjectURL(
        contentImage1Preview
      );
    }

    setContentImage1File(null);
    setContentImage1Preview("");
    setExistingContentImage1("");
    setContentImage1Title("");
    setRemoveContentImage1(true);
  }

  // =====================================================
  // CONTENT IMAGE 2
  // =====================================================

  function handleContentImage2Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!validateImage(file)) return;

    setContentImage2File(file);
    setRemoveContentImage2(false);

    if (contentImage2Preview) {
      URL.revokeObjectURL(
        contentImage2Preview
      );
    }

    setContentImage2Preview(
      URL.createObjectURL(file)
    );
  }

  function removeStoryImage2() {
    if (contentImage2Preview) {
      URL.revokeObjectURL(
        contentImage2Preview
      );
    }

    setContentImage2File(null);
    setContentImage2Preview("");
    setExistingContentImage2("");
    setContentImage2Title("");
    setRemoveContentImage2(true);
  }

  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  async function uploadImage(file, label) {
    if (!file) {
      return null;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const safeSlug =
      slug || "screening";

    const fileName =
      `${safeSlug}-${label}-${Date.now()}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("screening-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from("screening-images")
        .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // =====================================================
  // SAVE
  // =====================================================

  async function saveChanges(action) {
    setError("");

    if (!title.trim()) {
      setError(
        "Please enter a title."
      );
      return;
    }

    if (!slug.trim()) {
      setError(
        "Please enter a slug."
      );
      return;
    }

    if (!screeningDate) {
      setError(
        "Please select a screening date."
      );
      return;
    }

    setSaving(true);

    try {
      // =================================================
      // COVER IMAGE
      // =================================================

      let coverImageUrl =
        existingCover || null;

      if (coverFile) {
        coverImageUrl =
          await uploadImage(
            coverFile,
            "cover"
          );
      }

      // =================================================
      // STORY IMAGE 1
      // =================================================

      let contentImage1Url =
        existingContentImage1 || null;

      if (removeContentImage1) {
        contentImage1Url = null;
      }

      if (contentImage1File) {
        contentImage1Url =
          await uploadImage(
            contentImage1File,
            "content-1"
          );
      }

      // =================================================
      // STORY IMAGE 2
      // =================================================

      let contentImage2Url =
        existingContentImage2 || null;

      if (removeContentImage2) {
        contentImage2Url = null;
      }

      if (contentImage2File) {
        contentImage2Url =
          await uploadImage(
            contentImage2File,
            "content-2"
          );
      }

      // =================================================
      // PUBLICATION STATE
      // =================================================

      let newPublished =
        published;

      let newPublishedAt =
        publishedAt;

      if (action === "publish") {
        newPublished = true;

        if (!newPublishedAt) {
          newPublishedAt =
            new Date().toISOString();
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

      const { error: updateError } =
        await supabase
          .from("screenings")
          .update({
            title:
              title.trim(),

            slug:
              slug.trim(),

            short_description:
              shortDescription.trim() ||
              null,

            full_story:
              fullStory.trim() ||
              null,

            screening_date:
              screeningDate,

            screening_time:
              screeningTime ||
              null,

            venue:
              venue.trim() ||
              null,

            city:
              city.trim() ||
              null,

            registration_link:
              registrationLink.trim() ||
              null,

            cover_image:
              coverImageUrl,

            content_image_1:
              contentImage1Url,

            content_image_1_title:
              contentImage1Url
                ? contentImage1Title.trim() ||
                  null
                : null,

            content_image_2:
              contentImage2Url,

            content_image_2_title:
              contentImage2Url
                ? contentImage2Title.trim() ||
                  null
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

      router.push(
        "/admin/screenings"
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while updating the screening."
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
          Loading screening...
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
              Screening Management
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              Edit screening
            </h1>

          </div>


          <div
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] ${
              published
                ? "bg-green-100 text-green-700"
                : "bg-[#FC65C3]/20 text-[#6C0666]"
            }`}
          >
            {published
              ? "Published"
              : "Draft"}
          </div>

        </div>


        {/* =================================================
            FORM
        ================================================== */}

        <div className="mt-12 rounded-3xl bg-white p-7 shadow-[0_15px_50px_rgba(21,2,151,0.08)] md:p-10">


          {/* TITLE */}

          <div>

            <label className="text-sm font-bold">
              Screening title
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
                setSlug(
                  createSlug(
                    e.target.value
                  )
                )
              }
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
            />

            <p className="mt-2 text-xs text-[#888]">
              URL: /screenings/{slug}
            </p>

          </div>


          {/* SHORT DESCRIPTION */}

          <div className="mt-6">

            <label className="text-sm font-bold">
              Short description
            </label>

            <textarea
              value={shortDescription}
              onChange={(e) =>
                setShortDescription(
                  e.target.value
                )
              }
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-[#150297]/15 px-4 py-3 leading-7 outline-none focus:border-[#311EB2]"
            />

          </div>


          {/* =================================================
              WHEN & WHERE
          ================================================== */}

          <div className="mt-10 border-t border-[#150297]/10 pt-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              When & where
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Screening details
            </h2>

          </div>


          <div className="mt-7 grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-sm font-bold">
                Date
              </label>

              <input
                type="date"
                value={screeningDate}
                onChange={(e) =>
                  setScreeningDate(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>


            <div>

              <label className="text-sm font-bold">
                Time
              </label>

              <input
                type="time"
                value={screeningTime}
                onChange={(e) =>
                  setScreeningTime(
                    e.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>

          </div>


          {/* VENUE + CITY */}

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-sm font-bold">
                Venue
              </label>

              <input
                type="text"
                value={venue}
                onChange={(e) =>
                  setVenue(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>


            <div>

              <label className="text-sm font-bold">
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>

          </div>


          {/* REGISTRATION */}

          <div className="mt-6">

            <label className="text-sm font-bold">
              Registration link
            </label>

            <input
              type="url"
              value={registrationLink}
              onChange={(e) =>
                setRegistrationLink(
                  e.target.value
                )
              }
              placeholder="https://forms.gle/..."
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
            />

            <p className="mt-2 text-xs text-[#888]">
              Paste the Google Form or registration URL here.
            </p>

          </div>


          {/* =================================================
              COVER IMAGE
          ================================================== */}

          <div className="mt-10 border-t border-[#150297]/10 pt-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Visual
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Screening cover image
            </h2>

          </div>


          <div className="mt-6">

            {(coverPreview ||
              existingCover) && (

              <div className="overflow-hidden rounded-2xl">

                <img
                  src={
                    coverPreview ||
                    existingCover
                  }
                  alt="Screening cover"
                  className="aspect-[16/9] w-full object-cover"
                />

              </div>

            )}


            <label className="mt-4 inline-flex cursor-pointer rounded-full border border-[#150297]/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-[#150297] hover:text-white">

              {coverPreview ||
              existingCover
                ? "Replace cover image"
                : "Upload cover image"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleCoverImageChange
                }
                className="hidden"
              />

            </label>

          </div>


          {/* =================================================
              FULL STORY
          ================================================== */}

          <div className="mt-10 border-t border-[#150297]/10 pt-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Screening story
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Tell the full story
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#777]">
              Leave a blank line between paragraphs. The published
              page will preserve this structure.
            </p>

          </div>


          <textarea
            value={fullStory}
            onChange={(e) =>
              setFullStory(
                e.target.value
              )
            }
            rows={18}
            className="mt-6 w-full resize-y rounded-2xl border border-[#150297]/15 px-5 py-4 text-lg leading-8 outline-none focus:border-[#311EB2]"
          />


          {/* =================================================
              STORY IMAGES
          ================================================== */}

          <div className="mt-10 border-t border-[#150297]/10 pt-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Story images
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Images inside the screening story
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
              Replace, remove or update the captions for the
              optional images shown inside the screening story.
            </p>

          </div>


          {/* =================================================
              STORY IMAGE 1
          ================================================== */}

          <div className="mt-8 rounded-2xl border border-[#150297]/10 bg-[#FAF9FD] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-bold">
                  Story image 1
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
                        "Screening story image 1"
                      }
                      className="aspect-[16/9] w-full object-cover"
                    />

                  </div>


                  <button
                    type="button"
                    onClick={
                      removeStoryImage1
                    }
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
                  Upload story image
                </span>

                <span className="mt-1 text-xs text-[#888]">
                  JPG, PNG or WEBP · Maximum 5 MB
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleContentImage1Change
                  }
                  className="hidden"
                />

              </label>

            ) : (

              <label className="mt-4 inline-flex cursor-pointer rounded-full border border-[#150297]/20 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-[#150297] hover:text-white">

                Replace image

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleContentImage1Change
                  }
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
                placeholder="Example: Participants during the screening"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>

          </div>


          {/* =================================================
              STORY IMAGE 2
          ================================================== */}

          <div className="mt-6 rounded-2xl border border-[#150297]/10 bg-[#FAF9FD] p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-bold">
                  Story image 2
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
                        "Screening story image 2"
                      }
                      className="aspect-[16/9] w-full object-cover"
                    />

                  </div>


                  <button
                    type="button"
                    onClick={
                      removeStoryImage2
                    }
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
                  Upload story image
                </span>

                <span className="mt-1 text-xs text-[#888]">
                  JPG, PNG or WEBP · Maximum 5 MB
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleContentImage2Change
                  }
                  className="hidden"
                />

              </label>

            ) : (

              <label className="mt-4 inline-flex cursor-pointer rounded-full border border-[#150297]/20 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-[#150297] hover:text-white">

                Replace image

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleContentImage2Change
                  }
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
                placeholder="Example: Community discussion after the film"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mt-7 rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
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
                  published
                    ? "save"
                    : "draft"
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
                  saveChanges(
                    "publish"
                  )
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
                  saveChanges(
                    "unpublish"
                  )
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