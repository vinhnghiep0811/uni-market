import { ArrowRight } from "lucide-react";
import Image from "next/image";

import HeroSearchBar from "./hero/HeroSearchBar";
import PopularTags from "./hero/PopularTags";

type MarketplaceHeroProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectTag: (tag: string) => void;
};

export default function MarketplaceHero({
  searchQuery,
  onSearchChange,
  onSelectTag,
}: MarketplaceHeroProps) {
  const handleFindItems = () => {
    if (typeof window === "undefined") {
      return;
    }

    document
      .getElementById("marketplace-listings")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="px-8 pt-6">
      <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200/10 lg:grid-cols-[2fr_1fr]">
        <div className="relative flex items-center overflow-hidden bg-slate-800 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-0">
            <div className="absolute left-8 top-10 h-36 w-36 rounded-full" />
            <div className="absolute bottom-8 right-10 h-40 w-40 rounded-full" />
            <div className="absolute inset-y-0 right-0 w-24" />
          </div>

          <div className="relative z-10 w-full max-w-2xl">
            {/* <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-md">
              Trusted student-to-student marketplace
            </span> */}

            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl">
              Buy &amp; Sell within your{" "}
              <span className="text-cyan-300">campus</span>.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-blue-100/88 sm:text-lg">
              A trusted marketplace for students to trade textbooks,
              electronics, and dorm essentials.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <HeroSearchBar value={searchQuery} onChange={onSearchChange} />

              <button
                type="button"
                onClick={handleFindItems}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_-18px_rgba(255,255,255,0.7)] transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_20px_40px_-18px_rgba(103,232,249,0.65)] sm:px-7 sm:text-base"
              >
                Find Items
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <PopularTags onSelectTag={onSelectTag} />
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-slate-900">
          <Image
            src="/images/download.jpg"
            alt="Campus marketplace essentials"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,26,69,0.18)_5%,rgba(8,26,69,0.74)_42%,rgba(15,23,42,0.06)_78%)] lg:bg-[linear-gradient(90deg,rgba(8,26,69,0.82)_0%,rgba(8,26,69,0.36)_20%,rgba(15,23,42,0.1)_52%,rgba(15,23,42,0.18)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

          {/* <div className="absolute bottom-6 left-6 right-6 rounded-[28px] border border-white/15 bg-white/12 p-5 text-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:max-w-sm lg:left-auto">
            <p className="text-sm font-medium text-blue-100/78">
              Easy campus pickups
            </p>
            <p className="mt-2 text-xl font-semibold">
              From class notes to room upgrades, discover listings from people
              nearby.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}
