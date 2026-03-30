"use client";

import { ShieldCheck } from "lucide-react";

import Card from "@/components/ui/Card";

export default function ListingSafetyNotice() {
  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className="text-sm leading-6 text-slate-600 sm:text-[15px]">
          Meet in a public campus area and avoid transferring money before you inspect the item in person.
        </p>
      </div>
    </Card>
  );
}
