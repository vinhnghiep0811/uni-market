import { formatPriceRangeLabel } from "./utils";

type DynamicPriceRangeSliderProps = {
  value: number;
  ceiling: number;
  onChange: (value: number) => void;
};

export default function DynamicPriceRangeSlider({
  value,
  ceiling,
  onChange,
}: DynamicPriceRangeSliderProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Price Range</h2>
        </div>

        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {formatPriceRangeLabel(value, ceiling)}
        </span>
      </div>

      <div className="mt-5">
        <input
          type="range"
          min={0}
          max={ceiling}
          step={250000}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{formatPriceRangeLabel(0, ceiling)}</span>
          <span>{formatPriceRangeLabel(ceiling, ceiling)}</span>
        </div>
      </div>
    </section>
  );
}
