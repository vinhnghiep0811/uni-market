import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FavoritesSellCard() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] p-5 shadow-[0_18px_45px_-30px_rgba(37,99,235,0.45)]">
      <div className="rounded-[22px] border border-white/70 bg-white/75 p-5 backdrop-blur">
        <p className="text-sm font-medium text-blue-700">Need to declutter?</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Want to sell something?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Post your item in minutes and reach students on your campus.
        </p>

        <Link
          href="/sell"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-900"
        >
          Post a Listing
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
