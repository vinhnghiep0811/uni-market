import { ArrowUpRight } from "lucide-react";

export default function SellItemCard() {
  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-5 text-white shadow-lg shadow-slate-300/40">
      <div className="rounded-[22px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
        <p className="text-sm font-medium text-slate-300">Sell your items</p>
        <h2 className="mt-2 text-2xl font-semibold">
          Turn unused items into cash
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Reach verified students nearby and close deals faster on campus.
        </p>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
        >
          List an Item
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
