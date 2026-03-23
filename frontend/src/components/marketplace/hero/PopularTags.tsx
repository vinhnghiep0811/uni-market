const popularTags = ["Textbooks", "iPhone", "Desk Lamps", "Calculators"];

type PopularTagsProps = {
  onSelectTag: (tag: string) => void;
};

export default function PopularTags({ onSelectTag }: PopularTagsProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-blue-100/72">Popular:</span>
      {popularTags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelectTag(tag)}
          className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/18 hover:text-white"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
