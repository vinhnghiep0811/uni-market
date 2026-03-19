import GoogleLoginButton from "@/components/auth/google-login-button";
import Image from "next/image";
export default function LoginPage() {
    return (
        <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            {/* LEFT SIDE - INTRO */}
            <div className="relative hidden md:flex items-center px-16 py-16 overflow-hidden">
                {/* Background image */}
                <Image
                    src="/images/download.jpg"
                    alt="hero"
                    fill
                    className="object-cover object-[center_100%]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />


                {/* Content */}
                <div className="relative z-30 max-w-lg text-white">
                    <h1 className="text-3xl font-bold mb-4 leading-tight">
                        Buy. Sell. Connect on Campus.
                    </h1>

                    <p className="text-base text-white/85">
                        Discover a simpler way for students to trade textbooks,
                        electronics, and everyday essentials in one trusted marketplace.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - LOGIN */}
            <div className="flex items-center justify-center px-6">
                <div className="w-full max-w-md rounded-2xl p-8">

                    {/* App name - PRIMARY */}
                    <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-800 to-indigo-600 bg-clip-text text-transparent">
                        Uni Market
                    </h1>

                    {/* Welcome */}
                    <h2 className="text-xl font-semibold text-center mb-2">
                        Welcome
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm text-gray-400 text-center mb-6">
                        Log in to continue
                    </p>

                    {/* Google Button */}
                    <GoogleLoginButton />
                </div>
            </div>

        </main>
    );
}