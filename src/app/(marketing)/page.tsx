"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { toolsConfig } from "@/lib/config/tools";
import { LanguageProvider, useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

const cardHeaderGradient: Record<string, string> = {
  "Know Yourself": "card-header-green",
  "Market Your Brand": "card-header-blue",
  "Prove Yourself": "card-header-purple",
};

function HomePage() {
  const { t, language } = useLanguage();

  const tools = toolsConfig.map((tc) => ({
    name: t(tc.nameKey),
    desc: t(tc.longDescKey),
    icon: tc.icon,
    href: tc.href,
    phase: tc.phase,
    phaseKey: tc.phaseKey,
  }));

  const benefits = [
    t("landing.benefits.noAccount"),
    t("landing.benefits.privateData"),
    t("landing.benefits.autoFill"),
    t("landing.benefits.exportPdf"),
    t("landing.benefits.freeForever"),
  ];

  const phaseData = [
    {
      name: t("tools.phases.knowYourself"),
      tagline: t("landing.phase1.tagline"),
      desc: t("landing.phase1.desc"),
      tools: [
        t("landing.phase1.tools.0"),
        t("landing.phase1.tools.1"),
        t("landing.phase1.tools.2"),
        t("landing.phase1.tools.3"),
      ],
      gradientClass: "phase-gradient-green",
      textColor: "text-primary-800",
    },
    {
      name: t("tools.phases.marketYourBrand"),
      tagline: t("landing.phase2.tagline"),
      desc: t("landing.phase2.desc"),
      tools: [
        t("landing.phase2.tools.0"),
        t("landing.phase2.tools.1"),
        t("landing.phase2.tools.2"),
        t("landing.phase2.tools.3"),
      ],
      gradientClass: "phase-gradient-blue",
      textColor: "text-blue-700",
    },
    {
      name: t("tools.phases.proveYourself"),
      tagline: t("landing.phase3.tagline"),
      desc: t("landing.phase3.desc"),
      tools: [
        t("landing.phase3.tools.0"),
        t("landing.phase3.tools.1"),
        t("landing.phase3.tools.2"),
      ],
      gradientClass: "phase-gradient-purple",
      textColor: "text-purple-700",
    },
  ];

  const mockupTools = [
    { name: t("tools.knowYourself.name"), color: "bg-green-200" },
    { name: t("tools.applications.name"), color: "bg-blue-100" },
    { name: t("tools.resumes.name"), color: "bg-blue-200" },
    { name: t("tools.interviews.name"), color: "bg-blue-100" },
    { name: t("tools.jobSearch.name"), color: "bg-blue-200" },
    { name: t("tools.socialMedia.name"), color: "bg-blue-100" },
    { name: t("tools.landingTheJob.name"), color: "bg-purple-100" },
    { name: t("tools.contactLog.name"), color: "bg-purple-200" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:rounded-lg focus:bg-accent-blue focus:px-4 focus:py-2 focus:text-white focus:top-2 focus:left-2"
      >
        {t("common.skipToContent")}
      </a>
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" aria-current="page" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <span className="text-sm font-bold text-surface-dark">CR</span>
              </div>
              <span className="text-base font-semibold text-white">CareerReady</span>
            </Link>
            <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
              <a href="#how-it-works" className="rounded px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue min-h-[44px] inline-flex items-center">
                {t("landing.howItWorks")}
              </a>
              <a href="#tools" className="rounded px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue min-h-[44px] inline-flex items-center">
                {t("landing.toolsNav")}
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <a
              href="#tools"
              className="rounded-lg bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue-hover min-h-[44px] inline-flex items-center"
            >
              {t("common.seeTheTools")}
            </a>
          </div>
        </div>
      </header>

      {/* Hero — dark blue gradient with decorative orbs */}
      <section id="main-content" className="hero-gradient relative overflow-hidden px-6 pb-16 pt-24 md:pb-24 md:pt-36">
        {/* Decorative orbs */}
        <div className="hero-orb-blue -left-48 -top-24" aria-hidden="true" />
        <div className="hero-orb-purple -right-32 top-16" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[1120px] text-center">
          <h1 className={`mx-auto max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl ${language === "zh" ? "md:text-[64px]" : "md:text-[80px]"} md:leading-[0.95]`}>
            {t("landing.heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 md:text-xl">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/know-yourself"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-blue px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-accent-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              {t("common.getStartedFree")} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              {t("landing.seeHowItWorks")} <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* App preview mockup */}
          <div className="mx-auto mt-16 max-w-[820px]">
            <div className="rounded-xl border border-white/10 bg-white/5 p-1 shadow-2xl backdrop-blur-sm">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 rounded-t-lg bg-surface-lighter/50 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                </div>
                <div className="ml-3 flex-1 rounded-md bg-white/10 px-3 py-1 text-xs text-neutral-400">
                  careerready.pages.dev
                </div>
              </div>
              {/* Mini tool grid */}
              <div className="rounded-b-lg bg-white p-4">
                <div className="mb-3 text-left text-xs font-semibold text-neutral-800">{t("landing.yourToolkit")}</div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {mockupTools.map((mt) => (
                    <div key={mt.name} className={`rounded-lg ${mt.color} p-2.5`}>
                      <div className="h-1.5 w-6 rounded-full bg-black/10" />
                      <div className="mt-1.5 text-[11px] font-medium text-neutral-700 leading-tight">{mt.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <p className="mt-10 text-sm text-slate-400">
            {t("landing.trustBadge")}
          </p>
        </div>
      </section>

      {/* Benefits strip */}
      <section aria-label="Key benefits" className="border-b border-neutral-150 bg-neutral-50 py-4 sm:py-6">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-3 px-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2">
          {benefits.map((b) => (
            <span key={b} className="flex items-center gap-2 text-sm text-neutral-500">
              <CheckCircle className="h-4 w-4 shrink-0 text-accent-blue" aria-hidden="true" />
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* Phase walkthrough — 3 visual blocks */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
              {t("landing.phaseSectionTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500">
              {t("landing.phaseSectionSubtitle")}
            </p>
          </div>

          <div className="mt-16 space-y-16 md:space-y-24">
            {phaseData.map((phase, i) => (
              <div key={phase.name} className={`flex flex-col items-center gap-8 md:flex-row md:gap-12 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                {/* Gradient visual block */}
                <div className={`aspect-[4/3] w-full max-w-md rounded-xl ${phase.gradientClass} flex items-end p-6 md:w-1/2`}>
                  <div className="rounded-xl bg-white/80 p-4 backdrop-blur-sm shadow-lg w-full">
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t("common.phase")} {i + 1}</div>
                    <div className="mt-1 text-sm font-bold text-neutral-800">{phase.name}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {phase.tools.map((tool) => (
                        <span key={tool} className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">{tool}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Text */}
                <div className="w-full md:w-1/2">
                  <div className="text-sm font-semibold uppercase tracking-wider text-accent-blue">{t("common.phase")} {i + 1}</div>
                  <h3 className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl">{phase.tagline}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-neutral-500">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="bg-neutral-50 py-24 md:py-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
              {t("landing.toolsGridTitle")}
            </h2>
            <p className="mt-4 text-lg text-neutral-500">
              {t("landing.toolsGridSubtitle")}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tc) => (
              <Link
                key={tc.name}
                href={tc.href}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg motion-safe:hover:-translate-y-1"
              >
                {/* Colored gradient header */}
                <div className={`${cardHeaderGradient[tc.phase]} flex h-14 items-center justify-between px-5`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                    <tc.icon className="h-5 w-5 text-neutral-700" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-neutral-600 shadow-sm">
                    {t(tc.phaseKey)}
                  </span>
                </div>
                {/* Card body */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-neutral-900 flex items-center justify-between">
                    {tc.name}
                    <ArrowRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-accent-blue" />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{tc.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <div className="text-6xl font-bold text-neutral-200 leading-none" aria-hidden="true">&ldquo;</div>
          <p className="-mt-6 text-2xl font-medium leading-relaxed text-neutral-800 md:text-3xl">
            {t("landing.quoteText")}
          </p>
          <p className="mt-6 text-sm font-medium text-neutral-400">{t("landing.quoteAttribution")}</p>
        </div>
      </section>

      {/* CTA Section — full width, dark blue */}
      <section className="hero-gradient relative overflow-hidden px-6 py-24 md:py-32">
        <div className="hero-orb-blue -right-48 -bottom-24" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-[700px] text-center">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
            {t("landing.ctaDesc")}
          </p>
          <Link
            href="/know-yourself"
            className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-accent-blue px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-accent-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
          >
            {t("landing.startKnowYourself")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer — dark */}
      <footer className="bg-surface-dark">
        <div className="mx-auto max-w-[1120px] px-6 py-16">
          <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                  <span className="text-xs font-bold text-surface-dark">CR</span>
                </div>
                <span className="text-sm font-semibold text-white">CareerReady</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {t("landing.footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("landing.footer.coreTools")}</h4>
              <nav aria-label="Core Tools links" className="mt-3 flex flex-col gap-3">
                <Link href="/know-yourself" className="text-sm text-slate-400 hover:text-white transition-colors">{t("nav.knowYourself")}</Link>
                <Link href="/resumes" className="text-sm text-slate-400 hover:text-white transition-colors">{t("landing.footer.resumeBuilder")}</Link>
                <Link href="/interviews" className="text-sm text-slate-400 hover:text-white transition-colors">{t("landing.footer.interviewPrep")}</Link>
                <Link href="/applications" className="text-sm text-slate-400 hover:text-white transition-colors">{t("nav.applications")}</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("landing.footer.moreTools")}</h4>
              <nav aria-label="More Tools links" className="mt-3 flex flex-col gap-3">
                <Link href="/job-search" className="text-sm text-slate-400 hover:text-white transition-colors">{t("nav.jobSearch")}</Link>
                <Link href="/social-media" className="text-sm text-slate-400 hover:text-white transition-colors">{t("nav.socialMedia")}</Link>
                <Link href="/landing-the-job" className="text-sm text-slate-400 hover:text-white transition-colors">{t("nav.landingTheJob")}</Link>
                <Link href="/contact-log" className="text-sm text-slate-400 hover:text-white transition-colors">{t("nav.contactLog")}</Link>
              </nav>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("landing.footer.getStarted")}</h4>
              <nav aria-label="Get started links" className="mt-3 flex flex-col gap-3">
                <Link href="/know-yourself" className="text-sm text-slate-400 hover:text-white transition-colors">{t("landing.footer.step1")}</Link>
                <Link href="/resumes/builder" className="text-sm text-slate-400 hover:text-white transition-colors">{t("landing.footer.step2")}</Link>
                <Link href="/interviews/star-method" className="text-sm text-slate-400 hover:text-white transition-colors">{t("landing.footer.step3")}</Link>
                <Link href="/contact-log" className="text-sm text-slate-400 hover:text-white transition-colors">{t("landing.footer.step4")}</Link>
              </nav>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-6">
            <p className="text-xs text-slate-400">
              {t("landing.footer.bottomLine")}{" "}
              <Link href="/know-yourself" className="text-accent-blue hover:underline">{t("landing.footer.startNow")} &rarr;</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  );
}
