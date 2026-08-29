import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <main className="min-h-screen bg-white text-[#150297]">

      {/* =========================
          NAVIGATION
      ========================== */}

      <Navbar />


      {/* =========================
          ABOUT HERO
      ========================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/olakh-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#150297]/35" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-5xl text-white">

            <p
              className="text-lg font-bold uppercase tracking-[0.25em] text-[#FC65C3] md:text-xl lg:text-3xl"
              style={{
                WebkitTextStroke: "1px #6C0666",
              }}
            >
              About Olakh
            </p>

            <h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              Identity.
              <br />
              Recognition.
              <br />
              Knowing oneself.
            </h1>

            <p className="mt-10 max-w-3xl text-xl leading-8 md:text-2xl">
              ओळख — Identity. Recognition. Knowing oneself and being
              recognised by others.
            </p>

          </div>

        </div>
      </section>


      {/* =========================
          WHY OLAKH
      ========================== */}

      <section className="bg-white py-24 md:py-32">

        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-[0.8fr_1.2fr]">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
              Why cinema?
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Cinema shapes how we see the world.
            </h2>

          </div>


          <div className="text-xl leading-9 text-[#333] md:text-2xl">

            <p>
              Cinema does not simply tell us stories. It shapes how we
              see ourselves, how we see others, and who we believe
              belongs in the world.
            </p>

            <p className="mt-8">
              At Olakh, we see cinema as a space for questioning,
              conversation, learning and collective imagination.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          VISION & MISSION
      ========================== */}

      <section className="bg-[#311EB2] py-24 text-white md:py-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 md:grid-cols-2">

            {/* VISION */}

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FC65C3]">
                Our vision
              </p>

              <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                A Maharashtra where communities have space, agency and
                collective power.
              </h2>

              <p className="mt-8 text-lg leading-8 text-white/80 md:text-xl">
                A Maharashtra where marginalised communities have the
                space, agency and collective power to engage with,
                critique and create cinema.
              </p>

            </div>


            {/* MISSION */}

            <div className="border-t border-white/20 pt-8 md:border-l md:border-t-0 md:pl-16 md:pt-0">

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FC65C3]">
                Our mission
              </p>

              <p className="mt-6 text-3xl font-medium leading-tight md:text-4xl">
                To build community spaces where cinema becomes a tool
                for critical dialogue, feminist and anti-caste learning,
                cultural participation and collective expression.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FOUNDER
      ========================== */}

      <section className="bg-white py-24 md:py-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">


            {/* =========================
                FOUNDER IMAGE
            ========================== */}

            <div className="relative">

              <div className="overflow-hidden rounded-3xl bg-[#F3F0FA] shadow-[0_18px_55px_rgba(21,2,151,0.10)]">

                <img
                  src="/founder.jpg"
                  alt="Founder of The Olakh Collective"
                  className="aspect-[4/5] w-full object-cover"
                />

              </div>

            </div>


            {/* =========================
                FOUNDER INFORMATION
            ========================== */}

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
                Founder
              </p>


              <h2 className="mt-5 text-5xl font-bold leading-tight md:text-7xl">
                The person behind Olakh.
              </h2>


              {/* FOUNDER QUOTE */}

              <blockquote className="relative mt-8 border-l-4 border-[#FC65C3] py-2 pl-7 md:pl-9">

                {/* Decorative quotation mark */}
                <span
                  aria-hidden="true"
                  className="absolute -top-5 left-5 font-serif text-7xl leading-none text-[#FC65C3]/30 md:text-8xl"
                >
                  “
                </span>

                <p className="relative text-xl font-medium italic leading-9 text-[#150297] md:text-2xl">
                  I believe that when women at the margins are given a platform
                  to speak their lived truths, their voices do more than tell
                  stories—they have the power to transform society.
                </p>

              </blockquote>


              {/* FOUNDER BIO */}

              <div className="mt-8 rounded-2xl bg-[#F5F3FB] px-6 py-5 md:px-7 md:py-6">

                <p className="text-lg font-medium leading-8 text-[#211F2B]">
                  <span className="font-bold text-[#150297]">
                    Samruddhi Sawant
                  </span>{" "}
                  is currently pursuing her PhD in Mumbai. Her research focuses on
                  Scheduled Caste women and their spectatorship and engagement with
                  Indian cinema. Beyond academia, she is also a poet and performer,
                  based in Mumbai.
                </p>

              </div>

              {/* FOUNDER NAME */}

              <div className="mt-8 border-t border-[#150297]/15 pt-6">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
                  Founder
                </p>

                <p className="mt-2 text-2xl font-bold text-[#150297]">
                  Samruddhi Sawant
                </p>

                <p className="mt-1 text-sm leading-6 text-[#666]">
                  The Olakh Collective
                </p>

                <p className="mt-1 text-sm leading-6 text-[#666]">
                  theolakhcollective@gmail.com
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WHO IS OLAKH FOR
      ========================== */}

      <section className="bg-[#150297] py-24 text-white md:py-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 md:grid-cols-[0.8fr_1.2fr]">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FC65C3]">
                Who is Olakh for?
              </p>

              <h2 className="mt-5 text-5xl font-bold leading-tight md:text-7xl">
                A space for many voices.
              </h2>

            </div>


            <div className="grid gap-x-10 md:grid-cols-2">

              {[
                "Dalit, Bahujan and Adivasi communities",
                "Women",
                "Queer, trans and non-binary people",
                "Young people and students",
                "Film lovers",
                "Independent filmmakers",
                "Artists and cultural workers",
                "Researchers and academics",
                "Community organisers",
                "NGOs and grassroots organisations",
                "Educators",
                "Anyone interested in anti-caste and feminist cinema",
              ].map((item, index) => (

                <div
                  key={item}
                  className="border-b border-white/20 py-5"
                >

                  <span className="mr-4 text-sm text-[#FC65C3]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-lg leading-7 text-white/90">
                    {item}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CLOSING STATEMENT
      ========================== */}

      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{
          backgroundImage: "url('/olakh-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-[#150297]/40" />


        <div className="relative mx-auto max-w-5xl px-6 text-center text-white">

          <p className="text-3xl font-medium leading-tight md:text-5xl">
            You don&apos;t need to be a filmmaker, academic or film expert
            to join Olakh.
          </p>


          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
            You only need curiosity, willingness to listen and a desire
            to engage.
          </p>


          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <a
              href="/screenings"
              className="rounded-full bg-white px-7 py-3.5 font-medium text-[#150297] transition-transform hover:scale-105"
            >
              Explore screenings
            </a>


            <a
              href="/volunteer"
              className="rounded-full border border-white/60 px-7 py-3.5 font-medium transition-colors hover:bg-white hover:text-[#150297]"
            >
              Join Olakh
            </a>

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================== */}

      <Footer />

    </main>
  );
}