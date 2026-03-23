import Card from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";

import type { ProfileTab } from "./types";

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
};

const tabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "my-listings", label: "My Listings" },
  { id: "archived-sold", label: "Archived & Sold" },
];

export default function ProfileTabs({
  activeTab,
  onChangeTab,
}: ProfileTabsProps) {
  return (
    <Card className="p-2">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition duration-200",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
