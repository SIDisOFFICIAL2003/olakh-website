import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../../lib/supabase";

type Screening = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_story: string | null;

  screening_date: string;
  screening_time: string | null;

  venue: string | null;
  city: string | null;

  cover_image: string | null;

  content_image_1: string | null;
  content_image_1_title: string | null;

  content_image_2: string | null;
  content_image_2_title: string | null;

  registration_link: string | null;
};


// =====================================================
// DATE
// =====================================================

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


// =====================================================
// TIME
// =====================================================

function formatTime(time: string | null) {
  if (!time) return null;

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


// =====================================================
// UPCOMING / PREVIOUS
// =====================================================

function isUpcoming(date: string) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const screeningDate = new Date(`${date}T00:00:00`);

  return screeningDate >= today;
}


// =====================================================
// STORY IMAGE
// =====================================================

function StoryImage({
  src,
  caption,
  fallbackAlt,
}: {
  src: string | null;
  caption: string | null;
  fallbackAlt: string;
}) {
  if (!src) return null;

  return (
    <figure className="my-14 md:my-16">

      <div className="overflow-hidden rounded-2xl bg-[#F7F6FB] shadow-[0_14px_40px_rgba(21,2,151,0.08)]">

        <img
          src={src}
          alt={caption || fallbackAlt}
          className="max-h-[620px] w-full object-cover"
        />

      </div>


      {caption && (

        <figcaption className="mt-4 border-l-2 border-[#FC65C3] pl-4 text-sm leading-6 text-[#666]">
          {caption}
        </figcaption>

      )}

    </figure>
  );
}


// =====================================================
// SCREENING PAGE
// =====================================================

export default async function ScreeningPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;


  // =====================================================
  // GET SCREENING
  // =====================================================

  const { data, error } = await supabase
    .from("screenings")
    .select(`
      id,
      title,
      slug,
      short_description,
      full_story,
      screening_date,
      screening_time,
      venue,
      city,
      cover_image,
      content_image_1,
      content_image_1_title,
      content_image_2,
      content_image_2_title,
      registration_link
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single();


  const screening = data as Screening | null;


  // =====================================================
  // NOT FOUND
  // =====================================================

  if (error || !screening) {
    return (
      <main className="min-h-screen bg-white text-[#150297]">

        <Navbar />


        <section className="px-6 py-32 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FC65C3]">
            404
          </p>


          <h1 className="mt-5 text-5xl font-bold md:text-6xl">
            Screening not found
          </h1>


          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#666]">
            This screening may not exist or may not be published yet.
          </p>


          <a
            href="/screenings"
            className="mt-8 inline-flex rounded-full bg-[#150297] px-7 py-3.5 font-semibold text-white transition hover:bg-[#311EB2]"
          >
            ← Back to screenings
          </a>

        </section>


        <Footer />

      </main>
    );
  }


  // =====================================================
  // STATUS
  // =====================================================

  const upcoming =
    isUpcoming(screening.screening_date);


  // =====================================================
  // STORY PARAGRAPHS
  // =====================================================

  const storyParagraphs =
    screening.full_story
      ? screening.full_story
          .split(/\n\s*\n/)
          .map((paragraph) =>
            paragraph.trim()
          )
          .filter(Boolean)
      : [];


  // =====================================================
  // IMAGE POSITIONS
  // =====================================================

  const firstImagePosition =
    storyParagraphs.length > 2
      ? Math.ceil(
          storyParagraphs.length / 3
        )
      : 1;


  const secondImagePosition =
    storyParagraphs.length > 4
      ? Math.ceil(
          (storyParagraphs.length * 2) / 3
        )
      : storyParagraphs.length;


  return (
    <main className="min-h-screen bg-white text-[#150297]">

      <Navbar />


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#150297] text-white">


        {/* IMAGE */}

        {screening.cover_image && (

          <div className="absolute inset-0">

            <img
              src={screening.cover_image}
              alt={screening.title}
              className="h-full w-full object-cover"
            />

          </div>

        )}


        {/* IMAGE OVERLAY */}

        <div className="absolute inset-0 bg-[#150297]/80" />


        {/* PATTERN IF NO IMAGE */}

        {!screening.cover_image && (

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('/olakh-pattern.png')",
              backgroundSize:
                "cover",
              backgroundPosition:
                "center",
            }}
          />

        )}


        {!screening.cover_image && (

          <div className="absolute inset-0 bg-[#150297]/35" />

        )}


        {/* HERO CONTENT */}

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-36">

          <div className="max-w-5xl">


            {/* STATUS */}

            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                upcoming
                  ? "bg-[#FC65C3] text-[#150297]"
                  : "bg-white/15 text-white"
              }`}
            >
              {upcoming
                ? "Upcoming screening"
                : "Previous screening"}
            </span>


            {/* TITLE */}

            <h1 className="mt-7 max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
              {screening.title}
            </h1>


            {/* DESCRIPTION */}

            {screening.short_description && (

              <p className="mt-8 max-w-3xl whitespace-pre-line text-xl leading-8 text-white/80 md:text-2xl">
                {screening.short_description}
              </p>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          SCREENING INFORMATION
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6">

          <div className="relative -mt-8 grid overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(21,2,151,0.12)] md:grid-cols-3">


            {/* DATE */}

            <div className="border-b border-[#150297]/10 p-7 md:border-b-0 md:border-r md:p-9">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#311EB2]">
                Date
              </p>

              <p className="mt-3 text-xl font-bold text-[#150297]">
                {formatDate(
                  screening.screening_date
                )}
              </p>

            </div>


            {/* TIME */}

            <div className="border-b border-[#150297]/10 p-7 md:border-b-0 md:border-r md:p-9">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#311EB2]">
                Time
              </p>

              <p className="mt-3 text-xl font-bold text-[#150297]">
                {screening.screening_time
                  ? formatTime(
                      screening.screening_time
                    )
                  : "Time not listed"}
              </p>

            </div>


            {/* LOCATION */}

            <div className="p-7 md:p-9">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#311EB2]">
                Location
              </p>

              <p className="mt-3 text-xl font-bold text-[#150297]">

                {screening.venue &&
                screening.city
                  ? `${screening.venue}, ${screening.city}`
                  : screening.venue
                  ? screening.venue
                  : screening.city
                  ? screening.city
                  : "Location not listed"}

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STORY
      ====================================================== */}

      <section className="bg-white py-24 md:py-32">

        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-[0.65fr_1.35fr]">


          {/* =================================================
              LEFT
          ================================================== */}

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#311EB2]">
              {upcoming
                ? "About the screening"
                : "From the screening"}
            </p>


            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              {upcoming
                ? "Come watch, question and reflect with us."
                : "Cinema. Conversation. Community."}
            </h2>

          </div>


          {/* =================================================
              RIGHT
          ================================================== */}

          <div>


            {/* STORY */}

            {storyParagraphs.length > 0 ? (

              <div>

                {storyParagraphs.map(
                  (paragraph, index) => {

                    const paragraphNumber =
                      index + 1;

                    return (
                      <div key={index}>


                        {/* PARAGRAPH */}

                        <p className="mb-8 whitespace-pre-line text-lg leading-9 text-[#333] md:text-xl">
                          {paragraph}
                        </p>


                        {/* IMAGE 1 */}

                        {screening.content_image_1 &&
                          paragraphNumber ===
                            firstImagePosition && (

                            <StoryImage
                              src={
                                screening.content_image_1
                              }
                              caption={
                                screening.content_image_1_title
                              }
                              fallbackAlt={`${screening.title} - screening image 1`}
                            />

                          )}


                        {/* IMAGE 2 */}

                        {screening.content_image_2 &&
                          paragraphNumber ===
                            secondImagePosition && (

                            <StoryImage
                              src={
                                screening.content_image_2
                              }
                              caption={
                                screening.content_image_2_title
                              }
                              fallbackAlt={`${screening.title} - screening image 2`}
                            />

                          )}

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <>
                <p className="text-lg leading-8 text-[#666]">
                  More information about this screening will be
                  shared soon.
                </p>


                {/* SHOW IMAGES EVEN IF STORY IS EMPTY */}

                {screening.content_image_1 && (

                  <StoryImage
                    src={
                      screening.content_image_1
                    }
                    caption={
                      screening.content_image_1_title
                    }
                    fallbackAlt={`${screening.title} - screening image 1`}
                  />

                )}


                {screening.content_image_2 && (

                  <StoryImage
                    src={
                      screening.content_image_2
                    }
                    caption={
                      screening.content_image_2_title
                    }
                    fallbackAlt={`${screening.title} - screening image 2`}
                  />

                )}

              </>

            )}


            {/* =================================================
                REGISTRATION
            ================================================== */}

            {upcoming &&
              screening.registration_link && (

                <div className="mt-12 border-t border-[#150297]/10 pt-10">

                  <p className="text-sm font-semibold text-[#666]">
                    Interested in joining this screening?
                  </p>


                  <a
                    href={
                      screening.registration_link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-full bg-[#FC65C3] px-7 py-3.5 font-bold text-[#150297] transition-all hover:-translate-y-1 hover:bg-[#150297] hover:text-white"
                  >
                    Register for this screening →
                  </a>

                </div>

              )}

          </div>

        </div>

      </section>


      {/* =====================================================
          CLOSING
      ====================================================== */}

      <section
        className="relative overflow-hidden py-20 text-white md:py-24"
        style={{
          backgroundImage:
            "url('/olakh-pattern.png')",
          backgroundSize:
            "cover",
          backgroundPosition:
            "center",
        }}
      >

        <div className="absolute inset-0 bg-[#150297]/45" />


        <div className="relative mx-auto max-w-4xl px-6 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FC65C3]">
            The Olakh Collective
          </p>


          <h2 className="mt-6 text-3xl font-bold leading-tight text-white md:text-5xl">
            Watch together. Think together.
            <br />
            Question together. Build together.
          </h2>


          <a
            href="/screenings"
            className="mt-9 inline-flex rounded-full bg-white px-7 py-3.5 font-semibold text-[#150297] transition-transform hover:scale-105"
          >
            ← Explore all screenings
          </a>

        </div>

      </section>


      <Footer />

    </main>
  );
}