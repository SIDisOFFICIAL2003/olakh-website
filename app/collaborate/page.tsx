"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../../lib/supabase";

export default function CollaboratePage() {
  const [form, setForm] = useState({
    name: "",
    organisation: "",
    email: "",
    phone: "",
    city: "",
    collaboration_type: "",
    proposal: "",
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

    if (!form.proposal.trim()) {
      setError("Please tell us a little about the collaboration.");
      return;
    }

    setSubmitting(true);

    const { error: insertError } = await supabase
      .from("collaboration_submissions")
      .insert({
        name: form.name.trim(),
        organisation: form.organisation.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        collaboration_type:
          form.collaboration_type.trim() || null,
        proposal: form.proposal.trim(),
        status: "new",
      });

    if (insertError) {
      console.error(insertError);

      setError(
        "Something went wrong while submitting. Please try again."
      );

      setSubmitting(false);
      return;
    }

    setSuccess(true);

    setForm({
      name: "",
      organisation: "",
      email: "",
      phone: "",
      city: "",
      collaboration_type: "",
      proposal: "",
    });

    setSubmitting(false);
  }

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

        <div className="absolute inset-0 bg-[#150297]/40" />


        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-5xl">

            <p
              className="text-lg font-bold uppercase tracking-[0.25em] text-[#FC65C3] md:text-xl lg:text-3xl"
              style={{
                WebkitTextStroke: "1px #6C0666",
              }}
            >
              Collaborate with Olakh
            </p>


            <h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
              Build something
              <br />
              meaningful together.
            </h1>


            <p className="mt-10 max-w-3xl text-xl leading-8 text-white/85 md:text-2xl">
              We collaborate with organisations, filmmakers, artists,
              educators, researchers and community groups to create
              spaces for cinema, dialogue and collective learning.
            </p>

          </div>

        </div>

      </section>



      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="bg-white py-24 md:py-32">

        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[0.8fr_1.2fr]">


          {/* =================================================
              LEFT
          ================================================== */}

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
              Work with us
            </p>


            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Collaboration can take many forms.
            </h2>


            <p className="mt-6 text-lg leading-8 text-[#555]">
              If your work intersects with cinema, caste, gender,
              culture, education or community-building, we&apos;d love
              to hear from you.
            </p>


            <div className="mt-10 space-y-7">

              {[
                "Host or co-organise a community screening",
                "Partner on film conversations and cultural programmes",
                "Collaborate on feminist and anti-caste learning initiatives",
                "Work together on research and documentation",
                "Partner on community storytelling projects",
                "Collaborate with filmmakers, artists and cultural workers",
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



          {/* =================================================
              FORM
          ================================================== */}

          <div className="rounded-3xl bg-[#F7F6FB] p-7 shadow-[0_15px_50px_rgba(21,2,151,0.08)] md:p-10">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FC65C3]">
              Start a conversation
            </p>


            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Collaboration form
            </h2>


            <p className="mt-4 max-w-xl leading-7 text-[#666]">
              Tell us who you are and what you would like to build with
              Olakh.
            </p>


            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >


              {/* NAME + ORGANISATION */}

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
                    Organisation
                  </label>

                  <input
                    type="text"
                    name="organisation"
                    value={form.organisation}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                  />

                </div>

              </div>



              {/* EMAIL + PHONE */}

              <div className="mt-6 grid gap-6 md:grid-cols-2">

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

              </div>



              {/* CITY */}

              <div className="mt-6">

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



              {/* TYPE */}

              <div className="mt-6">

                <label className="text-sm font-bold">
                  What kind of collaboration are you interested in?
                </label>

                <select
                  name="collaboration_type"
                  value={form.collaboration_type}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#150297]/15 bg-white px-4 py-3 outline-none focus:border-[#311EB2]"
                >

                  <option value="">
                    Select collaboration type
                  </option>

                  <option value="Screening partnership">
                    Screening partnership
                  </option>

                  <option value="Community programme">
                    Community programme
                  </option>

                  <option value="Research">
                    Research
                  </option>

                  <option value="Education and workshops">
                    Education and workshops
                  </option>

                  <option value="Film or cultural project">
                    Film or cultural project
                  </option>

                  <option value="NGO or grassroots partnership">
                    NGO or grassroots partnership
                  </option>

                  <option value="Media and documentation">
                    Media and documentation
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>



              {/* PROPOSAL */}

              <div className="mt-6">

                <label className="text-sm font-bold">
                  Tell us about your idea *
                </label>

                <textarea
                  name="proposal"
                  value={form.proposal}
                  onChange={handleChange}
                  rows={8}
                  placeholder="What would you like to collaborate on? Tell us about your idea, organisation or community..."
                  className="mt-2 w-full resize-y rounded-2xl border border-[#150297]/15 bg-white px-4 py-3 leading-7 outline-none focus:border-[#311EB2]"
                />

              </div>



              {/* ERROR */}

              {error && (

                <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>

              )}



              {/* SUCCESS */}

              {success && (

                <div className="mt-6 rounded-xl bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
                  Thank you. Your collaboration proposal has been
                  submitted.
                </div>

              )}



              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 inline-flex rounded-full bg-[#FC65C3] px-7 py-3.5 font-bold text-[#150297] transition-all hover:-translate-y-1 hover:bg-[#150297] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >

                {submitting
                  ? "Submitting..."
                  : "Start a conversation →"}

              </button>

            </form>

          </div>

        </div>

      </section>


      <Footer />

    </main>
  );
}