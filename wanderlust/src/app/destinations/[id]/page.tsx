import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Star,
} from "lucide-react";
import EditDestinationDialog, {
  type Destination,
} from "@/components/EditDestinationDialog";
import DeleteDestinationDialog from "@/components/DeleteDestinationDialog";
import BookingCard from "@/components/booking/BookingCard";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const highlights = [
  "Luxury beachfront accommodation",
  "Visit local landmarks and attractions",
  "Traditional local cuisine experience",
  "Guided cultural tour",
  "Scenic trip to nearby viewpoints",
  "Free time to explore at your own pace",
];

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const token = await getTokenFromServer();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/destination/${encodeURIComponent(id)}`,{
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`
    }}
  );

  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      notFound();
    }
    throw new Error(`Could not load destination (${response.status}).`);
  }

  const destination: Destination | null = await response.json();

  if (!destination) {
    notFound();
  }

  const description =
    destination.description ||
    `Discover the magic of ${destination.name} in ${destination.country}, with beautiful scenery, local culture, and unforgettable experiences.`;

  return (
    <main className="flex-1 bg-white px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-[#13A5BF]"
          >
            <ArrowLeft className="size-3" aria-hidden="true" />
            Back to Destinations
          </Link>

          <div className="flex items-center gap-2">
            <EditDestinationDialog destination={destination} />
            <DeleteDestinationDialog
              destinationId={destination._id}
              destinationName={destination.name}
            />
          </div>
        </div>

        <div className="flex w-full justify-center">
          <Image
            src={destination.imageUrl}
            alt={`${destination.name}, ${destination.country}`}
            width={800}
            height={380}
            fetchPriority="high"
            className="block h-auto max-h-95 w-auto max-w-full"
          />
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-7">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px]">
            <section>
              <p className="flex items-center gap-1.5 text-sm text-neutral-600">
                <MapPin className="size-4" aria-hidden="true" />
                {destination.country}
              </p>

              <h1 className="mt-2 text-3xl leading-tight font-light tracking-tighter text-neutral-950 sm:text-4xl">
                {destination.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-1 font-medium text-neutral-900">
                  <Star
                    className="size-4 fill-green-600 text-green-600"
                    aria-hidden="true"
                  />
                  4.9
                </span>
                <span className="text-neutral-500">(234 reviews)</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-neutral-900">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {destination.duration}
                </span>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-medium tracking-tight text-neutral-950">
                  Overview
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {description}
                </p>
              </div>

              <div className="mt-7">
                <h2 className="text-xl font-medium tracking-tight text-neutral-950">
                  Highlights
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {description}
                </p>

                <ul className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-xs leading-5 text-neutral-600"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-green-600"
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <BookingCard destination={destination} />
          </div>
        </div>
      </div>
    </main>
  );
}