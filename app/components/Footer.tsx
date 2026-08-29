export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-[#150297] text-white">

      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 md:grid-cols-3 md:items-center">

          {/* =========================
              LEFT — BRAND
          ========================== */}

          <div>

            <p className="text-2xl font-bold tracking-tight">
              OLAKH
            </p>

            <p className="mt-2 text-sm text-white/60">
              An Anti-Caste Feminist Film Collective
            </p>

          </div>


          {/* =========================
              CENTER — TAGLINE
          ========================== */}

          <div className="text-left md:text-center">

            <p className="text-sm leading-6 text-white/60">
              Watch together. Think together.
              <br />
              Question together. Build together.
            </p>

          </div>


          {/* =========================
              RIGHT — CONTACT
          ========================== */}

          <div className="flex flex-col gap-4 md:items-end">


            {/* INSTAGRAM */}

            <a
              href="https://www.instagram.com/theolakhcollective/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Olakh Collective on Instagram"
              className="group flex items-center gap-3 text-white transition-opacity hover:opacity-60"
            >

              {/* Instagram Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
              >

                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />

              </svg>


              <span className="text-sm font-medium">
                @theolakhcollective
              </span>

            </a>


            {/* EMAIL */}

            <a
              href="mailto:theolakhcollective@gmail.com"
              aria-label="Email The Olakh Collective"
              className="group flex items-center gap-3 text-white transition-opacity hover:opacity-60"
            >

              {/* Email Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
              >

                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />

                <path d="M3 7l9 6 9-6" />

              </svg>


              <span className="text-sm font-medium">
                theolakhcollective@gmail.com
              </span>

            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}