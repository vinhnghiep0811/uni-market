"use client";

import { useEffect, useState } from "react";
import { getMe, logout} from "@/lib/auth";
import { AuthUser } from "@/types/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Logout thất bại");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <main className="p-6">
        <p>Chưa đăng nhập</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 rounded bg-black px-4 py-2 text-white"
        >
          Đi tới đăng nhập
        </button>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Uni Market</h1>

      <div className="max-w-md rounded-xl border p-4">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Họ tên:</strong> {user.fullName}</p>
        <p><strong>SĐT:</strong> {user.phoneNumber || "-"}</p>
        <p><strong>Facebook:</strong> {user.facebookLink || "-"}</p>

        {user.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="mt-4 h-20 w-20 rounded-full object-cover"
          />
        )}

        <button
          onClick={handleLogout}
          className="mt-6 rounded bg-red-600 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>
    </main>
  );
}