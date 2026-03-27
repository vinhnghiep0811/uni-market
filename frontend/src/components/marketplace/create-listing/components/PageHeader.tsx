export default function PageHeader() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl space-y-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Create New Listing
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Post your item to Uni Market and connect with students on campus.
          </p>
        </div>
      </div>
    </div>
  );
}
