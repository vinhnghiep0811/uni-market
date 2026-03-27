/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronRight, Facebook, Mail, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "UM"
  );
}

function formatFieldValue(value?: string | null) {
  return value?.trim() || "Not added yet";
}

export default function SellerInfoCard() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Card className="border border-slate-200 bg-white/95 p-6">
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-[15px]">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
              {getInitials(user.fullName)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold text-slate-950">
              {user.fullName}
            </p>
            <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-3">
          {/* <div className="flex items-start gap-3 rounded-[20px] bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Email
              </p>
              <p className="mt-1 break-all text-sm text-slate-700">
                {user.email}
              </p>
            </div>
          </div> */}

          <div className="flex items-start gap-3 rounded-[20px] px-4 py-3">
            <Facebook className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0">
              {/* <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Facebook
              </p> */}
              <p className="mt-1 break-all text-sm text-slate-700">
                {formatFieldValue(user.facebookLink)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-[20px] px-4 py-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="mt-1 break-all text-sm text-slate-700">
                {formatFieldValue(user.phoneNumber)}
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full rounded-2xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
          leadingIcon={<UserRound className="h-4 w-4" />}
          onClick={() => router.push("/profile")}
        >
          Update Profile
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
