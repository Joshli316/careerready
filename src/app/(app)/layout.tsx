import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ToastProvider } from "@/components/ui/Toast";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { SkipLink } from "@/components/layout/SkipLink";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <SkipLink />
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav />
          <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-4xl">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
    </LanguageProvider>
  );
}
