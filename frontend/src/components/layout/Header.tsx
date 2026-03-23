"use client";

import { Search, Bell, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">

                {/* LEFT - LOGO */}
                <div className="text-xl font-bold tracking-tight">
                    Uni Market
                </div>

                {/* CENTER - NAV */}
                <nav className="hidden md:flex items-center gap-8">
                    <a
                        href="#"
                        className="relative text-sm font-medium text-gray-900"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-black rounded"></span>
                    </a>

                    <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-black transition"
                    >
                        Marketplace
                    </a>

                    <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-black transition"
                    >
                        My Listings
                    </a>
                </nav>

                {/* RIGHT - ACTIONS */}
                <div className="flex items-center gap-4">

                    {/* SEARCH */}
                    <div
                        className={`flex items-center bg-gray-100 rounded-full px-3 py-2 transition-all duration-300 ${isFocused ? "w-72" : "w-56"
                            }`}
                    >
                        <Search className="w-4 h-4 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="bg-transparent outline-none text-sm w-full"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </div>

                    {/* ICONS */}
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>

                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* AVATAR */}
                    <div className="w-9 h-9 rounded-full overflow-hidden border">
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
