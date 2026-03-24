export default function PageHeader() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl space-y-3">
        <span className="inline-flex w-fit items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-950">
          Uni Market
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Create New Listing
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Post your item to Uni Market and connect with students on campus.
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
        <p className="text-sm font-semibold text-slate-900">
          Student-friendly selling
        </p>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
          Good photos, honest condition notes, and a clear meetup spot help
          listings move faster around campus.
        </p>
      </div>
    </div>
  );
}
