export const dynamic = "force-dynamic";

import { Banner } from "@/components/banner";
import Featured from "@/components/featured/Featured";
import { ReadyStartJourney } from "@/components/readyStartJourney";
import { WhatTravelersSay } from "@/components/whatTravelersSay";
import { WhyChooseUs } from "@/components/whyChooseUs";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Banner />
        <Featured/>
        <WhyChooseUs />
        <WhatTravelersSay />
        <ReadyStartJourney />
      </main>
    </>
  );
}

