"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }
    console.log("ProtectedRoute", { user, isLoading });	
    if (!user) {
        return null; // đang redirect
    }

    return <>{children}</>;
}
