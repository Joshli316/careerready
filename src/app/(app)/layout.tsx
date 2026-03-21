import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-lg focus:bg-primary-400 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav />
          <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8" aria-label="Main content">
            <div className="mx-auto max-w-4xl">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
