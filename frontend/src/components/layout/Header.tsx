"use client";

import { Bell, Heart, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#marketplace-listings", label: "Marketplace" },
  { href: "/favorites", label: "Saved Items" },
  { href: "/profile", label: "My Listings" },
];

export default function Header() {
  const [isFocused, setIsFocused] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-950">
          Uni Market
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/profile"
                  ? pathname === "/profile"
                  : item.href === "/favorites"
                    ? pathname === "/favorites"
                  : false;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-sm transition",
                  isActive
                    ? "font-medium text-slate-900"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-slate-900"></span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 lg:gap-4">
          <div
            className={`hidden items-center rounded-full bg-gray-100 px-3 py-2 transition-all duration-300 md:flex ${
              isFocused ? "w-72" : "w-56"
            }`}
          >
            <Search className="mr-2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-transparent text-sm outline-none"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <button className="rounded-full p-2 transition hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>

          <Link
            href="/favorites"
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                pathname === "/favorites" ? "fill-red-500 text-red-500" : "text-gray-600",
              )}
            />
          </Link>

          <Link href="/sell" className="hidden lg:block">
            <Button className="rounded-2xl bg-blue-950 px-4 text-white hover:bg-blue-900">
              Create Listing
            </Button>
          </Link>

          <div className="h-9 w-9 overflow-hidden rounded-full border">
            <Image
              src={user?.avatarUrl || "https://i.pravatar.cc/100"}
              alt="avatar"
              width={36}
              height={36}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
