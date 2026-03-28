"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { getMe } from "@/lib/auth";
export default function GoogleLoginButton() {
    const router = useRouter();
    const { refreshUser } = useAuth();

    return (
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    try {
                        const idToken = credentialResponse.credential!;
                        console.log(idToken);
                        const res = await loginWithGoogle(idToken);

                        const me = await getMe();
                        console.log("me:", me); // 🔥 cập nhật user global
                        await refreshUser();
                        router.push("/");
                    } catch (err) {
                        console.error(err);
                    }
                }}
                onError={() => console.error("Google login failed")}
                use_fedcm_for_prompt={true}
                size="large"
                width="320"
                shape="pill"
                theme="outline"
            />
        </div>

    );
}