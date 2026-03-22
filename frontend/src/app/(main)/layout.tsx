import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <Header />
            <main>{children}</main>
        </ProtectedRoute>
    );
}