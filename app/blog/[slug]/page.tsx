import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../../lib/supabase";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  cover_image: string | null;

  content_image_1: string | null;
  content_image_1_title: string | null;

  content_image_2: string | null;
  content_image_2_title: string | null;

  published_at: string | null;
};


// =====================================================
// CONTENT IMAGE COMPONENT
// =====================================================

function ContentImage({
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
// ARTICLE PAGE
// =====================================================

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;


  // =====================================================
  // FETCH BLOG
  // =====================================================

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(`
      id,
      title,
      slug,
      category,
      content,
      cover_image,
      content_image_1,
      content_image_1_title,
      content_image_2,
      content_image_2_title,
      published_at
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single();


  // =====================================================
  // 404
  // =====================================================

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white text-[#150297]">

        <Navbar />


        <section className="px-6 py-32 text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#311EB2]">
            404
          </p>


          <h1 className="mt-5 text-5xl font-bold">
            Article not found
          </h1>


          <p className="mx-auto mt-5 max-w-xl text-[#666]">
            This article may not exist or may not be published yet.
          </p>


          <a
            href="/blog"
            className="mt-8 inline-flex rounded-full bg-[#150297] px-6 py-3 font-semibold text-white transition hover:bg-[#311EB2]"
          >
            Back to Olakh Journal
          </a>

        </section>


        <Footer />

      </main>
    );
  }


  // =====================================================
  // FORMAT ARTICLE INTO PARAGRAPHS
  // =====================================================

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);


  // =====================================================
  // DECIDE WHERE IMAGES APPEAR
  // =====================================================

  const firstImagePosition =
    paragraphs.length > 2
      ? Math.ceil(paragraphs.length / 3)
      : 1;


  const secondImagePosition =
    paragraphs.length > 4
      ? Math.ceil((paragraphs.length * 2) / 3)
      : paragraphs.length;


  return (
    <main className="min-h-screen bg-white text-[#150297]">

      <Navbar />


      {/* =====================================================
          ARTICLE HERO
      ====================================================== */}

      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: post.cover_image
            ? `url('${post.cover_image}')`
            : "url('/olakh-pattern.png')",

          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <div className="absolute inset-0 bg-[#150297]/75" />


        <div className="relative mx-auto max-w-5xl px-6 py-28 md:py-40">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FC65C3]">
            {post.category}
          </p>


          <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.05] text-white md:text-7xl">
            {post.title}
          </h1>


          {post.published_at && (

            <p className="mt-8 text-sm text-white/60">

              {new Date(
                post.published_at
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}

            </p>

          )}

        </div>

      </section>


      {/* =====================================================
          ARTICLE CONTENT
      ====================================================== */}

      <article className="bg-white py-20 md:py-28">

        <div className="mx-auto max-w-3xl px-6">


          {paragraphs.map((paragraph, index) => {

            const paragraphNumber = index + 1;


            return (
              <div key={index}>

                {/* PARAGRAPH */}

                <p className="mb-8 whitespace-pre-line text-lg leading-9 text-[#333] md:text-xl">
                  {paragraph}
                </p>


                {/* CONTENT IMAGE 1 */}

                {post.content_image_1 &&
                  paragraphNumber === firstImagePosition && (

                    <ContentImage
                      src={post.content_image_1}
                      caption={post.content_image_1_title}
                      fallbackAlt={`${post.title} - article image 1`}
                    />

                  )}


                {/* CONTENT IMAGE 2 */}

                {post.content_image_2 &&
                  paragraphNumber === secondImagePosition && (

                    <ContentImage
                      src={post.content_image_2}
                      caption={post.content_image_2_title}
                      fallbackAlt={`${post.title} - article image 2`}
                    />

                  )}

              </div>
            );
          })}


          {/* =================================================
              EDGE CASE:
              EMPTY / VERY SHORT ARTICLE
          ================================================== */}

          {paragraphs.length === 0 && (

            <p className="text-lg leading-9 text-[#555]">
              No article content available.
            </p>

          )}


          {/* If the first image somehow wasn't inserted */}

          {post.content_image_1 &&
            paragraphs.length === 0 && (

              <ContentImage
                src={post.content_image_1}
                caption={post.content_image_1_title}
                fallbackAlt={`${post.title} - article image 1`}
              />

            )}


          {/* If the second image somehow wasn't inserted */}

          {post.content_image_2 &&
            paragraphs.length === 0 && (

              <ContentImage
                src={post.content_image_2}
                caption={post.content_image_2_title}
                fallbackAlt={`${post.title} - article image 2`}
              />

            )}

        </div>

      </article>


      {/* =====================================================
          BACK TO JOURNAL
      ====================================================== */}

      <section className="border-t border-[#150297]/10 bg-[#F7F6FB] py-16">

        <div className="mx-auto max-w-3xl px-6">

          <a
            href="/blog"
            className="inline-flex items-center gap-3 font-semibold text-[#311EB2] transition-transform hover:-translate-x-1"
          >
            ← Back to Olakh Journal
          </a>

        </div>

      </section>


      <Footer />

    </main>
  );
}