import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <RegisterForm />
                <p className="mt-4 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="font-medium underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </main>
    );
}