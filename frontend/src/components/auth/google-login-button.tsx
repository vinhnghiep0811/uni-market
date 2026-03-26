"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function GoogleLoginButton() {
    const router = useRouter();
    const { refreshUser } = useAuth();

    return (
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                try {
                    const idToken = credentialResponse.credential!;
                    console.log(idToken);
                    const res = await loginWithGoogle(idToken);
                    
                    await refreshUser(); // 🔥 cập nhật user global

                    router.push("/");
                } catch (err) {
                    console.error(err);
                }
            }}
            onError={() => console.error("Google login failed")}
            use_fedcm_for_prompt={true}
        />
    );
}