import { createFileRoute } from "@tanstack/react-router";
import { CustomCursor } from "@/components/az/CustomCursor";
import { Navbar } from "@/components/az/Navbar";
import { Hero } from "@/components/az/Hero";
import { Challenges } from "@/components/az/Challenges";
import { WhatWeDo } from "@/components/az/WhatWeDo";
import { Process } from "@/components/az/Process";
import { WhoWeWorkWith } from "@/components/az/WhoWeWorkWith";
import { Vision } from "@/components/az/Vision";
import { Contact } from "@/components/az/Contact";

const TITLE =
  "AZ Ventures Advisory | Business Transformation, Turnaround & Growth Advisory in Dubai";
const DESC =
  "Dubai-based business transformation and growth advisory firm helping SMEs fix operational issues, scale sustainably, and expand into the UAE market.";

const SITE = "https://azventures.co";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AZ Ventures Advisory LLC",
  description: DESC,
  url: SITE,
  email: "azventuresadvisory@gmail.com",
  telephone: "+971 4 269 8181",
  areaServed: "Dubai, United Arab Emirates",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: "/og.jpg" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative w-full bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
      <CustomCursor />
      <Hero />
      <Challenges />
      <WhatWeDo />
      <Process />
      <WhoWeWorkWith />
      <Vision />
      <Contact />
    </main>
  );
}
