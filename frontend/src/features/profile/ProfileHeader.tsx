import { Facebook, Mail, Phone } from "lucide-react";
import Image from "next/image";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type { ProfileUserViewModel } from "./types";
import {
  buildPhoneHref,
  formatJoinedDate,
  getInitials,
  normalizeFacebookLink,
} from "./utils";

type ProfileHeaderProps = {
  user: ProfileUserViewModel;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xl font-semibold text-slate-700">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.fullName}
                fill
                className="object-cover"
              />
            ) : (
              getInitials(user.fullName)
            )}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-slate-900">
              {user.fullName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </span>
              <span>Member since {formatJoinedDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.phoneNumber ? (
            <a href={buildPhoneHref(user.phoneNumber)}>
              <Button variant="secondary" leadingIcon={<Phone className="h-4 w-4" />}>
                Phone
              </Button>
            </a>
          ) : null}

          {user.facebookLink ? (
            <a
              href={normalizeFacebookLink(user.facebookLink)}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="secondary"
                leadingIcon={<Facebook className="h-4 w-4" />}
              >
                Facebook
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
