"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    MapPin,
    Star,
} from "lucide-react";

export interface FeaturedDestination {
    _id: string;
    name: string;
    country: string;
    price: string | number;
    duration: string;
    imageUrl: string;
}

const FeaturedSlider = ({
    destinations,
}: {
    destinations: FeaturedDestination[];
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const sliderRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const startScrollLeftRef = useRef(0);

    if (destinations.length === 0) {
        return (
            <p className="py-10 text-sm text-neutral-500">
                No featured destinations available right now.
            </p>
        );
    }

    const goToSlide = (nextIndex: number) => {
        setCurrentIndex(nextIndex);

        const slider = sliderRef.current;
        if (!slider) return;

        const targetCard = slider.children[nextIndex] as HTMLElement | undefined;
        if (targetCard) {
            slider.scrollTo({
                left: targetCard.offsetLeft,
                behavior: "smooth",
            });
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < destinations.length - 1) {
            goToSlide(currentIndex + 1);
        }
    };

    const handleScroll = () => {
        const slider = sliderRef.current;
        if (!slider) return;

        const isAtEnd =
            slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;
        if (isAtEnd) {
            setCurrentIndex(destinations.length - 1);
            return;
        }

        const firstCard = slider.children[0] as HTMLElement | undefined;
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth + 20; // gap-5 = 20px
        const index = Math.round(slider.scrollLeft / cardWidth);
        setCurrentIndex(Math.max(0, Math.min(index, destinations.length - 1)));
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        const slider = sliderRef.current;
        if (!slider) return;

        setIsDragging(true);
        startXRef.current = e.pageX - slider.offsetLeft;
        startScrollLeftRef.current = slider.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();

        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startXRef.current) * 1.5;
        sliderRef.current.scrollLeft = startScrollLeftRef.current - walk;
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    return (
        <div>
            <div
                ref={sliderRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                className={`relative flex gap-5 overflow-x-auto select-none scrollbar-none [&::-webkit-scrollbar]:hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
            >
                {destinations.map((destination) => (
                    <article
                        key={destination._id}
                        className="w-full shrink-0 md:w-[46%]"
                    >
                        <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
                            <Image
                                src={destination.imageUrl}
                                alt={`${destination.name}, ${destination.country}`}
                                fill
                                draggable={false}
                                sizes="(max-width: 768px) 100vw, 46vw"
                                className="object-cover transition-transform duration-300 hover:scale-105"
                            />

                            <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/85 px-2.5 py-1 text-xs font-medium text-neutral-900 backdrop-blur-sm">
                                <span>4.5</span>
                                <Star
                                    className="size-3 fill-neutral-900 text-neutral-900"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <MapPin className="size-3.5" aria-hidden="true" />
                                {destination.country}
                            </p>

                            <div className="mt-1.5 flex items-baseline justify-between gap-3">
                                <h3 className="font-serif text-xl font-normal text-neutral-950 sm:text-2xl">
                                    {destination.name}
                                </h3>

                                <p className="shrink-0 text-xl font-normal text-neutral-950 sm:text-2xl">
                                    ${destination.price}
                                    <span className="text-xs text-neutral-500">/Person</span>
                                </p>
                            </div>

                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
                                <CalendarDays className="size-3.5" aria-hidden="true" />
                                {destination.duration}
                            </p>

                            <Link
                                href={`/destinations/${destination._id}`}
                                draggable={false}
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-[#13A5BF] uppercase transition-colors hover:text-[#108da4]"
                            >
                                <span className="border-b border-[#13A5BF] pb-0.5">
                                    Book Now
                                </span>
                                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
            <div className="mt-8 flex items-center gap-6">
                <span className="text-lg font-light text-neutral-800">
                    {currentIndex + 1}/{destinations.length}
                </span>

                <div className="h-px flex-1 bg-neutral-200" />

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        aria-label="Previous destination"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-[#13A5BF] hover:text-[#13A5BF] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentIndex === destinations.length - 1}
                        aria-label="Next destination"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-[#13A5BF] hover:text-[#13A5BF] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedSlider;