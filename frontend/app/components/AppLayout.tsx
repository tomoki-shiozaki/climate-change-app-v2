import { AppNavbar, Footer, ErrorToast } from "@/components/common";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppNavbar />

      <main className="flex-1">{children}</main>

      <ErrorToast />
      <Footer />
    </div>
  );
}
