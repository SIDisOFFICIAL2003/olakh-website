"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <nav className="relative z-50 border-b border-white/20 bg-[#150297] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* =========================
            LOGO
        ========================== */}

        <a href="/" className="block shrink-0">
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

          <a href="/" className={getNavClass("/")}>
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

          <a href="/about" className={getNavClass("/about")}>
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

          <a href="/blog" className={getNavClass("/blog")}>
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

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 md:hidden"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                mobileOpen
                  ? "translate-y-[7px] rotate-45"
                  : ""
              }`}
            />

            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-[2px] w-5 bg-white transition-all duration-300 ${
                mobileOpen
                  ? "-translate-y-[7px] -rotate-45"
                  : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}

      <div
        className={`overflow-hidden border-t border-white/15 bg-[#150297] transition-all duration-300 md:hidden ${
          mobileOpen
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-6">

          <a
            href="/"
            onClick={closeMobileMenu}
            className={`border-b border-white/10 py-4 text-lg font-bold ${
              isActive("/")
                ? "text-[#FC65C3]"
                : "text-white"
            }`}
          >
            Home
          </a>

          <a
            href="/about"
            onClick={closeMobileMenu}
            className={`border-b border-white/10 py-4 text-lg font-bold ${
              isActive("/about")
                ? "text-[#FC65C3]"
                : "text-white"
            }`}
          >
            About
          </a>

          <a
            href="/screenings"
            onClick={closeMobileMenu}
            className={`border-b border-white/10 py-4 text-lg font-bold ${
              isActive("/screenings")
                ? "text-[#FC65C3]"
                : "text-white"
            }`}
          >
            Screenings
          </a>

          <a
            href="/blog"
            onClick={closeMobileMenu}
            className={`border-b border-white/10 py-4 text-lg font-bold ${
              isActive("/blog")
                ? "text-[#FC65C3]"
                : "text-white"
            }`}
          >
            Blog
          </a>

          <a
            href="/volunteer"
            onClick={closeMobileMenu}
            className={`border-b border-white/10 py-4 text-lg font-bold ${
              isActive("/volunteer")
                ? "text-[#FC65C3]"
                : "text-white"
            }`}
          >
            Volunteer
          </a>

          <a
            href="/collaborate"
            onClick={closeMobileMenu}
            className={`mt-5 rounded-full px-6 py-4 text-center text-base font-bold transition-all ${
              isActive("/collaborate")
                ? "bg-[#FC65C3] text-[#150297]"
                : "bg-white text-[#150297]"
            }`}
          >
            Collaborate
          </a>
        </div>
      </div>
    </nav>
  );
}