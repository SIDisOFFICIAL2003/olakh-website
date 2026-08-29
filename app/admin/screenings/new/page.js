"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminNavbar from "../../../components/AdminNavbar";

export default function NewScreeningPage() {
  const router = useRouter();

  // =====================================================
  // BASIC SCREENING FIELDS
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
  // IMAGE VALIDATION
  // =====================================================

  function validateImage(file) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG or WEBP image.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The image must be smaller than 5 MB.");
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

    setCoverPreview(URL.createObjectURL(file));
  }

  function removeCoverImage() {
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(null);
    setCoverPreview("");
  }

  // =====================================================
  // CONTENT IMAGE 1
  // =====================================================

  function handleContentImage1Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!validateImage(file)) return;

    setContentImage1File(file);

    if (contentImage1Preview) {
      URL.revokeObjectURL(contentImage1Preview);
    }

    setContentImage1Preview(URL.createObjectURL(file));
  }

  function removeContentImage1() {
    if (contentImage1Preview) {
      URL.revokeObjectURL(contentImage1Preview);
    }

    setContentImage1File(null);
    setContentImage1Preview("");
    setContentImage1Title("");
  }

  // =====================================================
  // CONTENT IMAGE 2
  // =====================================================

  function handleContentImage2Change(e) {
    const file = e.target.files?.[0];

    if (!file) return;
    if (!validateImage(file)) return;

    setContentImage2File(file);

    if (contentImage2Preview) {
      URL.revokeObjectURL(contentImage2Preview);
    }

    setContentImage2Preview(URL.createObjectURL(file));
  }

  function removeContentImage2() {
    if (contentImage2Preview) {
      URL.revokeObjectURL(contentImage2Preview);
    }

    setContentImage2File(null);
    setContentImage2Preview("");
    setContentImage2Title("");
  }

  // =====================================================
  // GENERIC IMAGE UPLOAD
  // =====================================================

  async function uploadImage(file, label) {
    if (!file) {
      return null;
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeSlug = slug || "screening";

    const fileName =
      `${safeSlug}-${label}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("screening-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("screening-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // =====================================================
  // SAVE SCREENING
  // =====================================================

  async function saveScreening(publishNow) {
    setError("");

    if (!title.trim()) {
      setError("Please enter the screening title.");
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a slug.");
      return;
    }

    if (!screeningDate) {
      setError("Please select the screening date.");
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
      // SCREENING DATA
      // =================================================

      const screeningData = {
        title: title.trim(),
        slug: slug.trim(),

        short_description:
          shortDescription.trim() || null,

        full_story:
          fullStory.trim() || null,

        screening_date:
          screeningDate,

        screening_time:
          screeningTime || null,

        venue:
          venue.trim() || null,

        city:
          city.trim() || null,

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

        registration_link:
          registrationLink.trim() || null,

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
        .from("screenings")
        .insert(screeningData);

      if (insertError) {
        throw insertError;
      }

      router.push("/admin/screenings");

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while saving the screening."
      );

      setSaving(false);
    }
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#F7F6FB] text-[#150297]">

      <AdminNavbar />


      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">

        {/* =================================================
            HEADER
        ================================================== */}

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#311EB2]">
            Screening Management
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Add a screening
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#666]">
            Add the screening details, location, images and story.
            You can save it as a draft before publishing it.
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================== */}

        <div className="mt-12 rounded-3xl bg-white p-7 shadow-[0_15px_50px_rgba(21,2,151,0.08)] md:p-10">


          {/* =================================================
              BASIC INFORMATION
          ================================================== */}

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Basic information
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              About the screening
            </h2>

          </div>


          {/* TITLE */}

          <div className="mt-8">

            <label className="text-sm font-bold">
              Screening title *
            </label>

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Example: Women, Cinema & Identity"
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3.5 text-lg outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/10"
            />

          </div>


          {/* SLUG */}

          <div className="mt-6">

            <label className="text-sm font-bold">
              Slug *
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(createSlug(e.target.value))
              }
              placeholder="women-cinema-identity"
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none transition focus:border-[#311EB2]"
            />

            <p className="mt-2 text-xs text-[#888]">
              URL: /screenings/{slug || "screening-name"}
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
                setShortDescription(e.target.value)
              }
              rows={4}
              placeholder="A short introduction to this screening..."
              className="mt-2 w-full resize-none rounded-xl border border-[#150297]/15 px-4 py-3 leading-7 outline-none transition focus:border-[#311EB2]"
            />

            <p className="mt-2 text-xs text-[#888]">
              This will appear on the screening card.
            </p>

          </div>


          {/* =================================================
              DATE & TIME
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
                Date *
              </label>

              <input
                type="date"
                value={screeningDate}
                onChange={(e) =>
                  setScreeningDate(e.target.value)
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
                  setScreeningTime(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>

          </div>


          {/* VENUE & CITY */}

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
                placeholder="Community Hall"
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
                placeholder="Mumbai"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
              />

            </div>

          </div>


          {/* REGISTRATION LINK */}

          <div className="mt-6">

            <label className="text-sm font-bold">
              Registration link
            </label>

            <input
              type="url"
              value={registrationLink}
              onChange={(e) =>
                setRegistrationLink(e.target.value)
              }
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-[#150297]/15 px-4 py-3 outline-none focus:border-[#311EB2]"
            />

            <p className="mt-2 text-xs text-[#888]">
              Optional. Add a Google Form, registration page or other
              signup link.
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

            <p className="mt-2 text-sm text-[#777]">
              This is the main image used for the screening.
            </p>

          </div>


          <div className="mt-6">

            {coverPreview ? (

              <div className="relative overflow-hidden rounded-2xl">

                <img
                  src={coverPreview}
                  alt="Screening preview"
                  className="aspect-[16/9] w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#150297] shadow"
                >
                  Remove
                </button>

              </div>

            ) : (

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/20 bg-[#F7F6FB] px-6 py-14 text-center transition hover:border-[#311EB2]">

                <span className="text-3xl">
                  +
                </span>

                <span className="mt-2 font-semibold">
                  Upload screening image
                </span>

                <span className="mt-1 text-xs text-[#888]">
                  JPG, PNG or WEBP · Maximum 5 MB
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />

              </label>

            )}

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
              For previous screenings, this can contain the detailed
              reflection, discussion, observations and outcomes from
              the screening.
            </p>

            <p className="mt-2 text-xs leading-5 text-[#999]">
              Leave a blank line between paragraphs. The published
              screening page will preserve your paragraph structure.
            </p>

          </div>


          <textarea
            value={fullStory}
            onChange={(e) =>
              setFullStory(e.target.value)
            }
            rows={18}
            placeholder={`Write about the screening...

Leave a blank line between paragraphs.

For example:

The screening brought together participants from across the community.

After the film, the conversation moved towards representation, identity and lived experience.`}
            className="mt-6 w-full resize-y rounded-2xl border border-[#150297]/15 px-5 py-4 text-lg leading-8 outline-none transition focus:border-[#311EB2]"
          />


          {/* =================================================
              STORY IMAGES
          ================================================== */}

          <div className="mt-10 border-t border-[#150297]/10 pt-8">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Story images
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Add images inside the screening story
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
              Add up to two optional images from the screening.
              They will appear naturally between sections of the
              story on the public screening page.
            </p>

          </div>


          {/* =================================================
              CONTENT IMAGE 1
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


            <div className="mt-4">

              {contentImage1Preview ? (

                <div>

                  <div className="relative overflow-hidden rounded-2xl">

                    <img
                      src={contentImage1Preview}
                      alt="Story image 1 preview"
                      className="aspect-[16/9] w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeContentImage1}
                      className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#150297] shadow"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ) : (

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/15 bg-white px-6 py-10 text-center transition hover:border-[#311EB2]">

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
                    onChange={handleContentImage1Change}
                    className="hidden"
                  />

                </label>

              )}

            </div>


            <div className="mt-5">

              <label className="text-sm font-bold">
                Image title / caption
              </label>

              <input
                type="text"
                value={contentImage1Title}
                onChange={(e) =>
                  setContentImage1Title(e.target.value)
                }
                placeholder="Example: Participants during the screening"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none transition focus:border-[#311EB2]"
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


            <div className="mt-4">

              {contentImage2Preview ? (

                <div>

                  <div className="relative overflow-hidden rounded-2xl">

                    <img
                      src={contentImage2Preview}
                      alt="Story image 2 preview"
                      className="aspect-[16/9] w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeContentImage2}
                      className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#150297] shadow"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ) : (

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#150297]/15 bg-white px-6 py-10 text-center transition hover:border-[#311EB2]">

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
                    onChange={handleContentImage2Change}
                    className="hidden"
                  />

                </label>

              )}

            </div>


            <div className="mt-5">

              <label className="text-sm font-bold">
                Image title / caption
              </label>

              <input
                type="text"
                value={contentImage2Title}
                onChange={(e) =>
                  setContentImage2Title(e.target.value)
                }
                placeholder="Example: Community discussion after the film"
                className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none transition focus:border-[#311EB2]"
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

          <div className="mt-10 flex flex-col gap-4 border-t border-[#150297]/10 pt-8 sm:flex-row sm:justify-end">

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                saveScreening(false)
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
                saveScreening(true)
              }
              className="rounded-full bg-[#FC65C3] px-7 py-3.5 font-bold text-[#150297] transition hover:-translate-y-1 hover:bg-[#150297] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Publishing..."
                : "Publish Screening"}
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}