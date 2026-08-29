import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../../lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
};

export default async function Blog() {

  // =====================================================
  // GET PUBLISHED BLOGS FROM SUPABASE
  // =====================================================

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, category, excerpt, cover_image, published_at"
    )
    .eq("published", true)
    .order("published_at", {
      ascending: false,
    });

  const blogPosts: BlogPost[] = data || [];

  if (error) {
    console.error("Error loading blogs:", error);
  }

  return (
    <main className="min-h-screen bg-white text-[#150297]">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

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
              Olakh Journal
            </p>

            <h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
              Thoughts,
              <br />
              conversations &
              <br />
              reflections.
            </h1>

            <p className="mt-10 max-w-3xl text-xl leading-8 text-white/85 md:text-2xl">
              Writing from the collective on cinema, caste, gender,
              identity, representation and the conversations that
              emerge around films.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          BLOG INTRO
      ====================================================== */}

      <section className="bg-white py-20 md:py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
              From Olakh
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Stories that continue beyond the screening.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#555] md:text-xl">
              Our journal brings together reflections, essays,
              conversations and observations emerging from our
              engagement with cinema and communities.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          BLOG POSTS
      ====================================================== */}

      <section className="bg-[#F7F6FB] py-20 md:py-28">

        <div className="mx-auto max-w-7xl px-6">


          {/* NO PUBLISHED BLOGS */}

          {blogPosts.length === 0 && (

            <div className="rounded-2xl bg-white px-8 py-20 text-center shadow-[0_10px_40px_rgba(21,2,151,0.08)]">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#FC65C3]">
                Olakh Journal
              </p>

              <h2 className="mt-5 text-4xl font-bold md:text-5xl">
                Stories are on their way.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#666]">
                We're preparing reflections, conversations and writing
                from the collective. Come back soon.
              </p>

            </div>

          )}


          {/* BLOG GRID */}

          {blogPosts.length > 0 && (

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {blogPosts.map((post) => (

                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >

                  <article className="h-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(21,2,151,0.08)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_25px_60px_rgba(21,2,151,0.16)]">


                    {/* IMAGE */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-[#150297]">

                      {post.cover_image ? (

                        <img
                          src={post.cover_image}
                          alt={post.title}
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


                      {/* CATEGORY */}

                      <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#150297]">
                        {post.category}
                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-7 md:p-8">


                      {/* DATE */}

                      {post.published_at && (

                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#311EB2]">

                          {new Date(
                            post.published_at
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}

                        </p>

                      )}


                      {/* TITLE */}

                      <h2 className="mt-4 text-2xl font-bold leading-tight text-[#150297] md:text-3xl">
                        {post.title}
                      </h2>


                      {/* EXCERPT */}

                      {post.excerpt && (

                        <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#666]">
                          {post.excerpt}
                        </p>

                      )}


                      {/* READ */}

                      <div className="mt-7 flex items-center justify-between border-t border-[#150297]/10 pt-5">

                        <span className="text-sm font-semibold text-[#150297]">
                          Read article
                        </span>

                        <span className="text-xl text-[#311EB2] transition-transform duration-300 group-hover:translate-x-2">
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


      {/* =====================================================
          CLOSING
      ====================================================== */}

      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{
          backgroundImage: "url('/olakh-pattern.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-[#150297]/45" />

        <div className="relative mx-auto max-w-5xl px-6 text-center text-white">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FC65C3]">
            Keep questioning
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Cinema doesn't end
            <br />
            when the film ends.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/75">
            Every screening can open another conversation.
            Every conversation can lead to another question.
          </p>

          <a
            href="/screenings"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-3.5 font-medium text-[#150297] transition-all duration-300 hover:-translate-y-1 hover:bg-[#FC65C3]"
          >
            Explore screenings →
          </a>

        </div>

      </section>


      <Footer />

    </main>
  );
}