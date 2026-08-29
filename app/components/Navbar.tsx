"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinkClass =
    "relative text-[15px] font-bold tracking-[0.04em] transition-all duration-300";

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function getNavClass(href: string) {
    const active = isActive(href);

    return `${navLinkClass} ${
      active
        ? "text-[#FC65C3]"
        : "text-white hover:text-[#FC65C3]"
    }`;
  }

  return (
    <nav className="relative z-20 border-b border-white/20 bg-[#150297] text-white">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* =========================
            LOGO
        ========================== */}

        <a
          href="/"
          className="block shrink-0"
        >
          <img
            src="/olakh-logo-transparent.png"
            alt="The Olakh Collective"
            className="h-12 w-auto md:h-14"
          />
        </a>


        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <div className="hidden items-center gap-8 md:flex">

          {/* HOME */}

          <a
            href="/"
            className={getNavClass("/")}
          >
            Home

            <span
              className={`absolute -bottom-2 left-0 h-[3px] rounded-full bg-[#FC65C3] transition-all duration-300 ${
                isActive("/")
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </a>


          {/* ABOUT */}

          <a
            href="/about"
            className={getNavClass("/about")}
          >
            About

            <span
              className={`absolute -bottom-2 left-0 h-[3px] rounded-full bg-[#FC65C3] transition-all duration-300 ${
                isActive("/about")
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </a>


          {/* SCREENINGS */}

          <a
            href="/screenings"
            className={getNavClass("/screenings")}
          >
            Screenings

            <span
              className={`absolute -bottom-2 left-0 h-[3px] rounded-full bg-[#FC65C3] transition-all duration-300 ${
                isActive("/screenings")
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </a>


          {/* BLOG */}

          <a
            href="/blog"
            className={getNavClass("/blog")}
          >
            Blog

            <span
              className={`absolute -bottom-2 left-0 h-[3px] rounded-full bg-[#FC65C3] transition-all duration-300 ${
                isActive("/blog")
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </a>


          {/* VOLUNTEER */}

          <a
            href="/volunteer"
            className={getNavClass("/volunteer")}
          >
            Volunteer

            <span
              className={`absolute -bottom-2 left-0 h-[3px] rounded-full bg-[#FC65C3] transition-all duration-300 ${
                isActive("/volunteer")
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </a>


          {/* COLLABORATE */}

          <a
            href="/collaborate"
            className={`
              rounded-full
              px-6
              py-3
              text-[14px]
              font-bold
              tracking-[0.04em]
              shadow-sm
              transition-all
              duration-300
              ${
                isActive("/collaborate")
                  ? "bg-[#FC65C3] text-[#150297] ring-2 ring-white/70"
                  : "bg-white text-[#150297] hover:-translate-y-0.5 hover:bg-[#FC65C3] hover:shadow-lg"
              }
            `}
          >
            Collaborate
          </a>

        </div>

      </div>

    </nav>
  );
}