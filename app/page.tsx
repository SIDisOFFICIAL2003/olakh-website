import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

type Screening = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  screening_date: string;
  screening_time: string | null;
  venue: string | null;
  city: string | null;
  cover_image: string | null;
  registration_link: string | null;
};


// =====================================================
// HELPERS
// =====================================================

function getTodayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}


function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


function formatMonthYear(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}


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
// HOME
// =====================================================

export default async function Home() {

  const today = getTodayInIndia();


  // =====================================================
  // NEXT UPCOMING SCREENING
  // =====================================================

  const { data: upcomingData, error: upcomingError } =
    await supabase
      .from("screenings")
      .select(`
        id,
        title,
        slug,
        short_description,
        screening_date,
        screening_time,
        venue,
        city,
        cover_image,
        registration_link
      `)
      .eq("published", true)
      .gte("screening_date", today)
      .order("screening_date", {
        ascending: true,
      })
      .limit(1);


  if (upcomingError) {
    console.error(
      "Error loading upcoming screening:",
      upcomingError
    );
  }


  const upcomingScreening: Screening | null =
    upcomingData?.[0] || null;


  // =====================================================
  // RECENT SCREENINGS
  // =====================================================

  const { data: recentData, error: recentError } =
    await supabase
      .from("screenings")
      .select(`
        id,
        title,
        slug,
        short_description,
        screening_date,
        screening_time,
        venue,
        city,
        cover_image,
        registration_link
      `)
      .eq("published", true)
      .lt("screening_date", today)
      .order("screening_date", {
        ascending: false,
      })
      .limit(3);


  if (recentError) {
    console.error(
      "Error loading recent screenings:",
      recentError
    );
  }


  const recentScreenings: Screening[] =
    recentData || [];


  // =====================================================
  // JOURNEY / IMPACT STATISTICS
  // =====================================================

  const [
    {
      count: publishedBlogsCount,
      error: publishedBlogsError,
    },
    {
      count: completedScreeningsCount,
      error: completedScreeningsError,
    },
  ] = await Promise.all([

    // COUNT PUBLISHED BLOGS

    supabase
      .from("blog_posts")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("published", true),


    // COUNT COMPLETED PUBLISHED SCREENINGS

    supabase
      .from("screenings")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("published", true)
      .lt("screening_date", today),

  ]);


  if (publishedBlogsError) {
    console.error(
      "Error counting published blogs:",
      publishedBlogsError
    );
  }


  if (completedScreeningsError) {
    console.error(
      "Error counting completed screenings:",
      completedScreeningsError
    );
  }


  const totalPublishedBlogs =
    publishedBlogsCount ?? 0;


  const totalCompletedScreenings =
    completedScreeningsCount ?? 0;


  // We are currently estimating
  // an average of 20 people per screening.

  const averageParticipantsPerScreening = 20;


  const estimatedParticipants =
    totalCompletedScreenings *
    averageParticipantsPerScreening;


  return (
    <main className="min-h-screen bg-[#150297] text-white">


      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <Navbar />


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/olakh-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-[#150297]/30" />


        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="grid items-center gap-16 lg:grid-cols-[1.6fr_0.8fr]">


            {/* =================================================
                LEFT — BRAND
            ================================================== */}

            <div className="max-w-5xl">

              <p
                className="mb-8 text-lg font-bold uppercase tracking-[0.25em] text-[#FC65C3] md:text-xl lg:text-4xl"
                style={{
                  WebkitTextStroke: "1px #6C0666",
                }}
              >
                The Olakh Collective
              </p>


              <h1 className="max-w-4xl text-3xl font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                An Anti-Caste Feminist
              </h1>


              <h1 className="max-w-4xl text-3xl font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                Film Collective
              </h1>


              <p className="mt-10 max-w-3xl text-xl leading-8 md:text-2xl">
                Watch together. Think together.
                <br />
                Question together. Build together.
              </p>


              <div className="mt-10 flex flex-wrap gap-4">

                <a
                  href="/screenings"
                  className="rounded-full bg-white px-7 py-3.5 font-medium text-[#150297] transition-transform hover:scale-105"
                >
                  Explore screenings
                </a>


                <a
                  href="/about"
                  className="rounded-full border border-white/60 px-7 py-3.5 font-medium transition-colors hover:bg-white hover:text-[#150297]"
                >
                  Know Olakh
                </a>

              </div>

            </div>



            {/* =================================================
                RIGHT — TOP UPCOMING CARD
            ================================================== */}

            <div className="relative flex justify-center lg:justify-end">

              {upcomingScreening ? (

                <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-[#150297] shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1 md:p-7">

                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#311EB2]">
                    Upcoming screening
                  </p>


                  <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                    Join our next screening
                  </h2>


                  <p className="mt-3 text-sm leading-5 text-[#666]">
                    Be part of our upcoming film screening
                    and collective conversation.
                  </p>


                  <div className="mt-5 space-y-3 border-t border-[#150297]/10 pt-5">

                    {/* DATE */}

                    <div className="flex items-center gap-3">

                      <span className="text-[#6C0666]">
                        ◷
                      </span>

                      <div>

                        <p className="text-[10px] uppercase tracking-wider text-[#888]">
                          Date
                        </p>

                        <p className="text-sm font-semibold">
                          {formatDate(
                            upcomingScreening.screening_date
                          )}
                        </p>

                      </div>

                    </div>


                    {/* TIME */}

                    {upcomingScreening.screening_time && (

                      <div className="flex items-center gap-3">

                        <span className="text-[#6C0666]">
                          ◷
                        </span>

                        <div>

                          <p className="text-[10px] uppercase tracking-wider text-[#888]">
                            Time
                          </p>

                          <p className="text-sm font-semibold">
                            {formatTime(
                              upcomingScreening.screening_time
                            )}
                          </p>

                        </div>

                      </div>

                    )}


                    {/* LOCATION */}

                    {(upcomingScreening.venue ||
                      upcomingScreening.city) && (

                      <div className="flex items-center gap-3">

                        <span className="text-[#6C0666]">
                          ⌖
                        </span>

                        <div>

                          <p className="text-[10px] uppercase tracking-wider text-[#888]">
                            Location
                          </p>

                          <p className="text-sm font-semibold">
                            {[
                              upcomingScreening.venue,
                              upcomingScreening.city,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                        </div>

                      </div>

                    )}

                  </div>


                  <a
                    href={`/screenings/${upcomingScreening.slug}`}
                    className="mt-6 inline-flex rounded-full bg-[#FC65C3] px-5 py-2.5 text-sm font-bold text-[#150297] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#150297] hover:text-white"
                  >
                    Join the screening →
                  </a>

                </div>

              ) : (

                <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-[#150297] shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-7">

                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#311EB2]">
                    Upcoming screening
                  </p>


                  <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                    Join our next screening
                  </h2>


                  <p className="mt-3 text-sm leading-5 text-[#666]">
                    We don&apos;t have a screening announced right now.
                    Our next gathering will appear here soon.
                  </p>


                  <a
                    href="/screenings"
                    className="mt-6 inline-flex rounded-full bg-[#FC65C3] px-5 py-2.5 text-sm font-bold text-[#150297]"
                  >
                    Explore screenings →
                  </a>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="bg-white py-24 text-[#150297] md:py-32">

        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2 md:items-start">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
              Who we are
            </p>


            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Cinema is more than what happens on the screen.
            </h2>

          </div>


          <div className="text-lg leading-8 text-[#333] md:text-xl">

            <p>
              Olakh is a community-led film collective creating spaces
              for marginalised communities to watch, discuss, question
              and reimagine cinema through the intersections of caste,
              gender, sexuality, class and identity.
            </p>


            <p className="mt-6">
              Olakh is not only about watching films. It is about
              building communities of spectators who can ask who is
              represented, who is excluded, who gets to tell stories,
              and how cinema shapes the ways we understand ourselves
              and one another.
            </p>


            <a
              href="/about"
              className="mt-8 inline-block border-b-2 border-[#311EB2] pb-1 font-semibold text-[#311EB2]"
            >
              Read more about Olakh →
            </a>

          </div>

        </div>

      </section>



      {/* =====================================================
          RECENT SCREENINGS
      ====================================================== */}

      <section className="bg-[#311EB2] py-24 md:py-32">

        <div className="mx-auto max-w-7xl px-6">


          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/70">
                From the collective
              </p>


              <h2 className="mt-4 text-4xl font-bold md:text-6xl">
                Recent screenings
              </h2>

            </div>


            <a
              href="/screenings"
              className="font-medium underline underline-offset-8"
            >
              View all screenings →
            </a>

          </div>



          <div className="mt-14 grid gap-6 md:grid-cols-3">

            {recentScreenings.length > 0 ? (

              recentScreenings.map((screening) => (

                <a
                  key={screening.id}
                  href={`/screenings/${screening.slug}`}
                  className="group block"
                >

                  <article className="h-full overflow-hidden bg-[#150297] transition-transform duration-300 hover:-translate-y-1">


                    <div className="aspect-[4/3] overflow-hidden bg-[#150297]">

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
                            backgroundImage:
                              "url('/olakh-pattern.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />

                      )}

                    </div>


                    <div className="p-6">

                      <p className="text-sm text-white/60">
                        {screening.city || "Olakh"}
                        {" · "}
                        {formatMonthYear(
                          screening.screening_date
                        )}
                      </p>


                      <h3 className="mt-3 line-clamp-2 text-2xl font-semibold">
                        {screening.title}
                      </h3>


                      <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">

                        <p className="line-clamp-1 text-sm font-medium text-white/80">

                          {[
                            screening.venue,
                            screening.city,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                            "Location not listed"}

                        </p>


                        <span className="ml-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>

                      </div>

                    </div>

                  </article>

                </a>

              ))

            ) : (

              <div className="md:col-span-3">

                <p className="text-white/60">
                  Previous screenings will appear here.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>



      {/* =====================================================
          BOTTOM UPCOMING SCREENING
      ====================================================== */}

      <section className="bg-white py-24 text-[#150297] md:py-32">

        <div className="mx-auto max-w-7xl px-6">


          {upcomingScreening ? (

            <div className="grid overflow-hidden bg-[#150297] md:grid-cols-2">


              {/* =================================================
                  LEFT
              ================================================== */}

              <div className="flex min-h-[500px] flex-col justify-center p-8 text-white md:p-14">


                <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                  Upcoming screening
                </p>


                <h2 className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl">
                  Film, conversation & community
                </h2>


                <p className="mt-6 max-w-lg leading-7 text-white/80">
                  Join us for our next screening and collective
                  conversation around cinema, identity and lived
                  experience.
                </p>


                {/* SCREENING INFORMATION */}

                <div className="mt-8 space-y-3 text-sm text-white">

                  <p className="font-medium text-white">
                    {formatDate(
                      upcomingScreening.screening_date
                    )}
                  </p>


                  {upcomingScreening.screening_time && (

                    <p className="font-medium text-white">
                      {formatTime(
                        upcomingScreening.screening_time
                      )}
                    </p>

                  )}


                  {(upcomingScreening.venue ||
                    upcomingScreening.city) && (

                    <p className="font-medium text-white">

                      {[
                        upcomingScreening.venue,
                        upcomingScreening.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}

                    </p>

                  )}

                </div>


                <div className="mt-10 flex flex-wrap gap-3">

                  <a
                    href={`/screenings/${upcomingScreening.slug}`}
                    className="inline-block rounded-full bg-white px-6 py-3 font-medium text-[#150297] transition-all hover:-translate-y-1 hover:bg-[#FC65C3]"
                  >
                    Know more
                  </a>


                  {upcomingScreening.registration_link && (

                    <a
                      href={upcomingScreening.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full border border-white/50 px-6 py-3 font-medium text-white transition hover:bg-white hover:text-[#150297]"
                    >
                      Register
                    </a>

                  )}

                </div>

              </div>



              {/* =================================================
                  RIGHT — PATTERN + BIGGER CARD
              ================================================== */}

              <div
                className="relative flex min-h-[500px] items-center justify-center overflow-hidden p-8 md:p-10"
                style={{
                  backgroundImage:
                    "url('/olakh-pattern.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >

                <div className="absolute inset-0 bg-[#150297]/10" />


                {/* =================================================
                    BIGGER WHITE CARD
                ================================================== */}

                <a
                  href={`/screenings/${upcomingScreening.slug}`}
                  className="group relative z-10 w-full max-w-[400px] overflow-hidden rounded-[22px] bg-white text-[#150297] shadow-[0_24px_70px_rgba(0,0,0,0.34)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_32px_80px_rgba(0,0,0,0.40)]"
                >


                  {/* IMAGE */}

                  <div className="relative aspect-[16/9] overflow-hidden bg-[#150297]">

                    {upcomingScreening.cover_image ? (

                      <img
                        src={upcomingScreening.cover_image}
                        alt={upcomingScreening.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                    ) : (

                      <div
                        className="h-full w-full"
                        style={{
                          backgroundImage:
                            "url('/olakh-pattern.png')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                    )}


                    {/* UPCOMING BADGE */}

                    <div className="absolute left-5 top-5 rounded-full bg-[#FC65C3] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#150297] shadow-md">
                      Upcoming
                    </div>

                  </div>



                  {/* CARD CONTENT */}

                  <div className="p-7">


                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#311EB2]">
                      Next screening
                    </p>


                    <h3 className="mt-3 line-clamp-2 text-2xl font-bold leading-tight md:text-[28px]">
                      {upcomingScreening.title}
                    </h3>


                    {/* DETAILS */}

                    <div className="mt-5 border-t border-[#150297]/10 pt-5">

                      <p className="text-sm font-semibold text-[#150297]">
                        {formatDate(
                          upcomingScreening.screening_date
                        )}
                      </p>


                      {upcomingScreening.screening_time && (

                        <p className="mt-2 text-sm text-[#666]">
                          {formatTime(
                            upcomingScreening.screening_time
                          )}
                        </p>

                      )}


                      {(upcomingScreening.venue ||
                        upcomingScreening.city) && (

                        <p className="mt-2 line-clamp-1 text-sm text-[#777]">

                          {[
                            upcomingScreening.venue,
                            upcomingScreening.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}

                        </p>

                      )}

                    </div>


                    {/* VIEW SCREENING */}

                    <div className="mt-6 flex items-center justify-between">

                      <span className="text-sm font-bold">
                        View screening
                      </span>


                      <span className="text-xl text-[#311EB2] transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>

                    </div>

                  </div>

                </a>

              </div>

            </div>

          ) : (

            /* =================================================
                NO UPCOMING SCREENING
            ================================================== */

            <div className="grid overflow-hidden bg-[#150297] md:grid-cols-2">


              <div className="flex min-h-[500px] flex-col justify-center p-8 text-white md:p-14">

                <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                  Upcoming screening
                </p>


                <h2 className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl">
                  Film, conversation & community
                </h2>


                <p className="mt-6 max-w-lg leading-7 text-white/80">
                  Our next screening has not been announced yet.
                  Stay connected with Olakh for the next gathering.
                </p>


                <a
                  href="/screenings"
                  className="mt-10 inline-block w-fit rounded-full bg-white px-6 py-3 font-medium text-[#150297]"
                >
                  Explore screenings
                </a>

              </div>


              <div
                className="min-h-[500px]"
                style={{
                  backgroundImage:
                    "url('/olakh-pattern.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

            </div>

          )}

        </div>

      </section>



      {/* =====================================================
          PHILOSOPHY
      ====================================================== */}

      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{
          backgroundImage:
            "url('/olakh-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-[#150297]/40" />


        <div className="relative mx-auto max-w-5xl px-6 text-center text-white">

          <p className="text-sm uppercase tracking-[0.25em]">
            Our approach
          </p>


          <h2 className="mt-8 text-4xl font-bold leading-tight md:text-6xl">
            Who is represented?
            <br />
            Who is excluded?
            <br />
            Who gets to tell stories?
          </h2>


          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
            We use cinema as a starting point for questioning,
            conversation and collective imagination.
          </p>

        </div>

      </section>



      {/* =====================================================
          OUR JOURNEY
      ====================================================== */}

      <section className="bg-white py-24 text-[#150297] md:py-32">

        <div className="mx-auto max-w-7xl px-6">


          {/* HEADER */}

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
              Our journey
            </p>


            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Building spaces for dialogue.
            </h2>


            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#666]">
              Every screening, conversation and piece of writing
              contributes to a growing collective space around cinema,
              identity and lived experience.
            </p>

          </div>



          {/* =================================================
              JOURNEY STATISTICS
          ================================================== */}

          <div className="mt-12 grid grid-cols-2 border-t border-[#150297]/20 lg:mt-16 lg:grid-cols-4">


            {/* BLOGS PUBLISHED */}

            <div className="border-b border-r border-[#150297]/15 py-7 pr-4 sm:py-10 sm:pr-8 lg:border-b-0 lg:px-7 lg:first:pl-0">

              <p className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {totalPublishedBlogs}
              </p>


              <p className="mt-4 text-base font-bold text-[#150297]">
                Blogs published
              </p>


              <p className="mt-2 max-w-[230px] text-xs leading-5 text-[#777] sm:text-sm sm:leading-6">
                Stories, reflections and ideas shared through the
                Olakh Journal.
              </p>

            </div>



            {/* SCREENINGS COMPLETED */}

            <div className="border-b border-[#150297]/15 py-7 pl-4 sm:py-10 sm:pl-8 lg:border-b-0 lg:border-r lg:px-7">

              <p className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {totalCompletedScreenings}
              </p>


              <p className="mt-4 text-base font-bold text-[#150297]">
                Screenings done
              </p>


              <p className="mt-2 max-w-[230px] text-xs leading-5 text-[#777] sm:text-sm sm:leading-6">
                Film screenings and collective conversations that
                have already taken place.
              </p>

            </div>



            {/* ESTIMATED PARTICIPANTS */}

            <div className="border-r border-[#150297]/15 py-7 pr-4 sm:py-10 sm:pr-8 lg:border-b-0 lg:px-7">

              <p className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">

                {estimatedParticipants}

                {estimatedParticipants > 0 && (
                  <span className="text-[#FC65C3]">
                    +
                  </span>
                )}

              </p>


              <p className="mt-4 text-base font-bold text-[#150297]">
                Estimated participants
              </p>


              <p className="mt-2 max-w-[230px] text-xs leading-5 text-[#777] sm:text-sm sm:leading-6">
                Estimated community participation across completed
                screenings.
              </p>

            </div>



            {/* AVERAGE */}

            <div className="py-7 pl-4 sm:py-10 sm:pl-8 lg:px-7 lg:pr-0">

              <p className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {averageParticipantsPerScreening}
              </p>


              <p className="mt-4 text-base font-bold text-[#150297]">
                Average per screening
              </p>


              <p className="mt-2 max-w-[230px] text-xs leading-5 text-[#777] sm:text-sm sm:leading-6">
                Current estimated average number of participants
                attending each screening.
              </p>

            </div>

          </div>


          {/* ESTIMATE NOTE */}

          <p className="mt-8 text-xs leading-5 text-[#999]">
            Participant figures are estimates based on an average
            attendance of 20 people per completed screening.
          </p>

        </div>

      </section>



      {/* =====================================================
          GET INVOLVED
      ====================================================== */}

      <section className="bg-[#150297] py-24 md:py-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-6 md:grid-cols-2">


            <a
              href="/volunteer"
              className="group bg-[#311EB2] p-8 transition-transform hover:-translate-y-1 md:p-12"
            >

              <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                Get involved
              </p>


              <h2 className="mt-5 text-4xl font-bold">
                Volunteer with Olakh
              </h2>


              <p className="mt-5 max-w-md leading-7 text-white/80">
                Contribute your time, skills and energy to screenings,
                conversations and community-building.
              </p>


              <p className="mt-8 font-medium">
                Become a volunteer →
              </p>

            </a>



            <a
              href="/collaborate"
              className="group bg-white p-8 text-[#150297] transition-transform hover:-translate-y-1 md:p-12"
            >

              <p className="text-sm uppercase tracking-[0.25em] text-[#311EB2]">
                Work with us
              </p>


              <h2 className="mt-5 text-4xl font-bold">
                Collaborate with Olakh
              </h2>


              <p className="mt-5 max-w-md leading-7 text-[#444]">
                Partner with us to organise screenings, conversations,
                research and community initiatives.
              </p>


              <p className="mt-8 font-medium text-[#311EB2]">
                Start a conversation →
              </p>

            </a>

          </div>

        </div>

      </section>



      {/* =====================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </main>
  );
}