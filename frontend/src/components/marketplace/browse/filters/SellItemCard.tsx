import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function SellItemCard() {
  return (
    <section className="overflow-hidden rounded-3xl bg-gray-300 border border-gray-350 p-5 text-white">
      <div className="rounded-[22px] p-3 backdrop-blur-sm">
        <p className="text-2xl font-semibold text-black">Sell your items</p>
        {/* <h2 className="mt-2 text-2xl font-semibold">
          Turn unused items into cash
        </h2> */}
        <p className="mt-3 text-sm leading-6 text-black">
          Done with your semester? Turn your old books into cash.
        </p>

        <Link
          href="/sell"
          className="mt-5 inline-flex w-full justify-center items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
        >
          List an Item
        </Link>
      </div>
    </section>
  );
}
