import type { MarketplaceCondition } from "../types";

type ConditionFilterProps = {
  conditions: MarketplaceCondition[];
  selectedCondition: MarketplaceCondition;
  onChange: (condition: MarketplaceCondition) => void;
};

export default function ConditionFilter({
  conditions,
  selectedCondition,
  onChange,
}: ConditionFilterProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">Condition</h2>
        <p className="mt-1 text-sm text-slate-500">
          Compare new and pre-owned listings quickly.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {conditions.map((condition) => {
          const isActive = selectedCondition === condition;

          return (
            <button
              key={condition}
              type="button"
              onClick={() => onChange(condition)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {condition}
            </button>
          );
        })}
      </div>
    </section>
  );
}
