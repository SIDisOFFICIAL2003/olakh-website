import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../../lib/supabase";

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

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
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

function isUpcoming(date: string) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const screeningDate = new Date(`${date}T00:00:00`);

  return screeningDate >= today;
}

export default async function ScreeningsPage() {

  // =====================================================
  // FETCH PUBLISHED SCREENINGS
  // =====================================================

  const { data, error } = await supabase
    .from("screenings")
    .select(
      `
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
      `
    )
    .eq("published", true)
    .order("screening_date", {
      ascending: true,
    });

  if (error) {
    console.error("Error loading screenings:", error);
  }

  const screenings: Screening[] = data || [];

  const upcomingScreenings = screenings.filter((screening) =>
    isUpcoming(screening.screening_date)
  );

  const previousScreenings = screenings
    .filter((screening) => !isUpcoming(screening.screening_date))
    .reverse();

  return (
    <main className="min-h-screen bg-white text-[#150297]">

      <Navbar />


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: "url('/olakh-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-[#150297]/45" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-5xl">

            <p
              className="text-lg font-bold uppercase tracking-[0.25em] text-[#FC65C3] md:text-xl lg:text-3xl"
              style={{
                WebkitTextStroke: "1px #6C0666",
              }}
            >
              Screenings
            </p>

            <h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
              Cinema becomes
              <br />
              a space for dialogue.
            </h1>

            <p className="mt-10 max-w-3xl text-xl leading-8 text-white/85 md:text-2xl">
              We watch together, sit with stories, ask questions and
              create spaces for collective reflection.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          UPCOMING SCREENINGS
      ====================================================== */}

      <section className="bg-white py-24 md:py-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-14">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
              What's next
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-6xl">
              Upcoming screenings
            </h2>

          </div>


          {upcomingScreenings.length === 0 ? (

            /* =================================================
               NO UPCOMING SCREENINGS
            ================================================== */

            <div className="rounded-3xl bg-[#150297] px-8 py-20 text-center text-white shadow-[0_20px_60px_rgba(21,2,151,0.15)] md:px-16">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FC65C3]">
                Stay tuned
              </p>

              <h3 className="mt-5 text-4xl font-bold md:text-5xl">
                No upcoming screenings
              </h3>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
                We don't have a screening announced right now.
                Follow Olakh for updates about our next gathering.
              </p>

              <a
                href="https://www.instagram.com/theolakhcollective/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-[#150297] transition-all hover:-translate-y-1 hover:bg-[#FC65C3]"
              >
                Follow Olakh →
              </a>

            </div>

          ) : (

            <div className="grid gap-8 md:grid-cols-2">

              {upcomingScreenings.map((screening) => (

                <article
                  key={screening.id}
                  className="group overflow-hidden rounded-3xl bg-[#150297] text-white shadow-[0_20px_50px_rgba(21,2,151,0.15)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(21,2,151,0.25)]"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[16/9] overflow-hidden bg-[#150297]">

                    {screening.cover_image ? (

                      <img
                        src={screening.cover_image}
                        alt={screening.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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

                    <div className="absolute left-5 top-5 rounded-full bg-[#FC65C3] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#150297]">
                      Upcoming
                    </div>

                  </div>


                  {/* CONTENT */}

                  <div className="p-7 md:p-9">

                    <h3 className="text-3xl font-bold leading-tight md:text-4xl">
                      {screening.title}
                    </h3>

                    {screening.short_description && (

                      <p className="mt-4 text-sm leading-7 text-white/70">
                        {screening.short_description}
                      </p>

                    )}


                    {/* DETAILS */}

                    <div className="mt-7 grid gap-5 border-t border-white/15 pt-6 sm:grid-cols-3">

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                          Date
                        </p>

                        <p className="mt-2 text-sm font-medium">
                          {formatDate(screening.screening_date)}
                        </p>

                      </div>


                      {screening.screening_time && (

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                            Time
                          </p>

                          <p className="mt-2 text-sm font-medium">
                            {formatTime(screening.screening_time)}
                          </p>

                        </div>

                      )}


                      {(screening.venue || screening.city) && (

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                            Location
                          </p>

                          <p className="mt-2 text-sm font-medium">
                            {[screening.venue, screening.city]
                              .filter(Boolean)
                              .join(", ")}
                          </p>

                        </div>

                      )}

                    </div>


                    {/* ACTIONS */}

                    <div className="mt-8 flex flex-wrap gap-3">

                      <a
                        href={`/screenings/${screening.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#150297] transition-all hover:-translate-y-1 hover:bg-[#FC65C3]"
                      >
                        View screening
                        <span>→</span>
                      </a>


                      {screening.registration_link && (

                        <a
                          href={screening.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#150297]"
                        >
                          Register
                        </a>

                      )}

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          PREVIOUS SCREENINGS
      ====================================================== */}

      <section className="bg-[#311EB2] py-24 text-white md:py-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-white/60">
                From the collective
              </p>

              <h2 className="mt-4 text-4xl font-bold md:text-6xl">
                Previous screenings
              </h2>

            </div>

            <p className="max-w-md text-white/60">
              Explore the screenings we've held and the conversations
              that emerged from them.
            </p>

          </div>


          {previousScreenings.length === 0 ? (

            <div className="mt-14 rounded-2xl border border-white/20 px-8 py-14 text-center">

              <p className="text-white/60">
                Previous screenings will appear here.
              </p>

            </div>

          ) : (

            <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">

              {previousScreenings.map((screening) => (

                <a
                  key={screening.id}
                  href={`/screenings/${screening.slug}`}
                  className="group block"
                >

                  <article className="h-full overflow-hidden rounded-2xl bg-[#150297] shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]">

                    {/* IMAGE */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-[#150297]">

                      {screening.cover_image ? (

                        <img
                          src={screening.cover_image}
                          alt={screening.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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


                      {/* DATE */}

                      <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#150297]">
                        {formatDate(screening.screening_date)}
                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-7">

                      {screening.city && (

                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FC65C3]">
                          {screening.city}
                        </p>

                      )}


                      <h3 className="mt-3 text-2xl font-bold leading-tight">
                        {screening.title}
                      </h3>


                      {screening.short_description && (

                        <p className="mt-4 text-sm leading-6 text-white/65">
                          {screening.short_description}
                        </p>

                      )}


                      {/* LOCATION */}

                      <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-5">

                        <div>

                          <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                            Location
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {[screening.venue, screening.city]
                              .filter(Boolean)
                              .join(", ") || "Location not listed"}
                          </p>

                        </div>


                        <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
                          →
                        </span>

                      </div>

                    </div>

                  </article>

                </a>

              ))}

            </div>

          )}

        </div>

      </section>


      <Footer />

    </main>
  );
}