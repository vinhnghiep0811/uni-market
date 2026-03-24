import { Search } from "lucide-react";

type HeroSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function HeroSearchBar({
  value,
  onChange,
}: HeroSearchBarProps) {
  return (
    <label className="group flex flex-1 items-center gap-3 rounded-full border border-white/15 bg-white/12 px-5 py-4 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.95)] backdrop-blur-xl transition duration-200 focus-within:border-cyan-300/60 focus-within:bg-white/16 hover:bg-white/14">
      <Search className="h-5 w-5 text-blue-100/70 transition group-focus-within:text-cyan-200" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What are you looking for today?"
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-blue-100/55 sm:text-base"
      />
    </label>
  );
}
