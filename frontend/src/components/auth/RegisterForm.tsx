"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { AuthResponse, RegisterPayload } from "@/types/auth";

export default function RegisterForm() {
    const router = useRouter();

    const [form, setForm] = useState<RegisterPayload>({
        fullName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await apiRequest<AuthResponse>("/auth/register", {
                method: "POST",
                body: form,
            });

            router.push("/");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        >
            <div>
                <h1 className="text-2xl font-bold">Đăng ký</h1>
                <p className="text-sm text-gray-500">
                    Tạo tài khoản để bắt đầu sử dụng
                </p>
            </div>

            <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium">
                    Họ và tên
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                    Mật khẩu
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
                />
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
        </form>
    );
}