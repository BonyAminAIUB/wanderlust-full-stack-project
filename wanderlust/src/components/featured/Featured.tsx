import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeaturedSlider, { FeaturedDestination } from "./FeaturedSlider";

async function getFeaturedDestinations(): Promise<FeaturedDestination[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured-destinations`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Failed to load featured destinations:", error);
    return [];
  }
}

const Featured = async () => {
  const destinations = await getFeaturedDestinations();

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-normal tracking-tight text-neutral-950 sm:text-4xl">
              Featured Destinations
            </h2>
            <p className="mt-1.5 text-xs text-neutral-500 sm:text-sm">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-3 border border-[#13A5BF] px-5 py-2.5 text-xs font-medium tracking-wider text-[#13A5BF] uppercase transition-colors hover:bg-[#13A5BF] hover:text-white"
          >
            All Destinations
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Slider Section */}
        <FeaturedSlider destinations={destinations} />
      </div>
    </section>
  );
};

export default Featured;