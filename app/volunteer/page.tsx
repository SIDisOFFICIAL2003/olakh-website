"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../../lib/supabase";

export default function VolunteerPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    interests: "",
    availability: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase
      .from("volunteer_submissions")
      .insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        interests: form.interests.trim() || null,
        availability: form.availability.trim() || null,
        message: form.message.trim() || null,
        status: "new",
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error(insertError);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setSuccess(true);

    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      interests: "",
      availability: "",
      message: "",
    });

    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#150297]">
      <Navbar />

      {/* HERO */}

      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: "url('/olakh-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#150297]/40" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-5xl">
            <p
              className="text-lg font-bold uppercase tracking-[0.25em] text-[#FC65C3] md:text-xl lg:text-3xl"
              style={{
                WebkitTextStroke: "1px #6C0666",
              }}
            >
              Volunteer with Olakh
            </p>

            <h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
              Become part of
              <br />
              the collective.
            </h1>

            <p className="mt-10 max-w-3xl text-xl leading-8 text-white/85 md:text-2xl">
              Cinema can create conversations, but communities make
              those conversations possible.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[0.8fr_1.2fr]">

          {/* LEFT */}

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
              Why volunteer?
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Help us build spaces for dialogue.
            </h2>

            <div className="mt-10 space-y-7">
              {[
                "Help organise community screenings",
                "Support film conversations and discussions",
                "Work with communities and participants",
                "Help document screenings and reflections",
                "Contribute skills in design, writing, research or outreach",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex gap-5 border-b border-[#150297]/10 pb-6"
                >
                  <span className="text-sm font-bold text-[#FC65C3]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-lg leading-7 text-[#333]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}

          <div className="rounded-3xl bg-[#F7F6FB] p-7 shadow-[0_15px_50px_rgba(21,2,151,0.08)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Join us
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Volunteer form
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-[#666]">
              Tell us a little about yourself and how you would like to
              contribute.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold">
                    Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold">
                  How would you like to contribute?
                </label>

                <select
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                >
                  <option value="">
                    Select an area
                  </option>

                  <option value="Screening support">
                    Screening support
                  </option>

                  <option value="Community outreach">
                    Community outreach
                  </option>

                  <option value="Documentation">
                    Documentation
                  </option>

                  <option value="Writing and research">
                    Writing and research
                  </option>

                  <option value="Design and social media">
                    Design and social media
                  </option>

                  <option value="Film discussion facilitation">
                    Film discussion facilitation
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold">
                  Availability
                </label>

                <select
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                >
                  <option value="">
                    Select availability
                  </option>

                  <option value="Weekdays">
                    Weekdays
                  </option>

                  <option value="Weekends">
                    Weekends
                  </option>

                  <option value="Occasionally">
                    Occasionally
                  </option>

                  <option value="Flexible">
                    Flexible
                  </option>
                </select>
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us anything else you'd like us to know..."
                  className="mt-2 w-full resize-y rounded-2xl border border-[#150297]/15 bg-white px-4 py-3 leading-7 outline-none focus:border-[#311EB2]"
                />
              </div>

              {error && (
                <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-6 rounded-xl bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
                  Thank you. Your volunteer form has been submitted.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 inline-flex rounded-full bg-[#FC65C3] px-7 py-3.5 font-bold text-[#150297] transition-all hover:-translate-y-1 hover:bg-[#150297] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Join the collective →"}
              </button>

            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}