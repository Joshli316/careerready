"use client";

import { useState, useEffect, useCallback } from "react";
import { Callout } from "@/components/ui/Callout";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CheckCircle, XCircle } from "lucide-react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { SavedIndicator } from "@/components/ui/SavedIndicator";

const auditCategories = [
  { category: "Drug use, excessive drinking, or partying content", key: "drugs" },
  { category: "Sexually explicit or profane images and comments", key: "explicit" },
  { category: "References to unlawful activity", key: "unlawful" },
  { category: "Aggressive or violent acts or assertions", key: "aggressive" },
  { category: "Discriminatory behavior or language", key: "discriminatory" },
];

const doList = [
  "Professional headshot photo",
  "Content interesting and relevant to your industry",
  "Up-to-date industry news and shared articles",
  "A wide range of interests",
  "Profile matching your application and resume",
];

const dontList = [
  "Default or inappropriate profile image",
  "Images/posts that contradict your professional brand",
  "Poor grammar and spelling mistakes",
  "Profanity or references to alcohol/drug use",
  "Negative comments about past employers or co-workers",
];

export default function AuditPage() {
  const { saved, save, storage } = useProfileSave();
  const [results, setResults] = useState<Record<string, "pass" | "fail" | null>>({});

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.socialAudit) {
        setResults(profile.socialAudit);
      }
    });
  }, [storage]);

  const handleSave = useCallback(() => save({ socialAudit: results }), [save, results]);

  return (
    <div>
      <Breadcrumb href="/social-media" label="Social Media" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Online Presence Audit</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Review your social media through an employer's eyes. 45% of employers research candidates online,
          and 1 in 3 have rejected someone based on what they found.
        </p>
      </div>

      <SavedIndicator visible={saved} />

      <Callout type="warning" className="mb-6">
        Before starting your job search, Google yourself and review every social media profile.
        Set all personal accounts to private. Everything public is fair game for employers.
      </Callout>

      {/* Do / Don't */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-success">Include</h2>
          <ul className="space-y-2">
            {doList.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-neutral-600">
                <CheckCircle className="h-4 w-4 shrink-0 text-success mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-neutral-150 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-error">Don't Include</h2>
          <ul className="space-y-2">
            {dontList.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-neutral-600">
                <XCircle className="h-4 w-4 shrink-0 text-error mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Self-Audit */}
      <section className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-neutral-800">Background Check Self-Audit</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Review your posts and pictures. Would you pass an employer's screening in these categories?
        </p>
        <div className="space-y-3">
          {auditCategories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between rounded-lg border border-neutral-150 p-4">
              <span className="text-sm text-neutral-700">{cat.category}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setResults({ ...results, [cat.key]: "pass" })}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    results[cat.key] === "pass" ? "bg-green-50 text-green-700 border border-green-200" : "bg-neutral-50 text-neutral-500 hover:bg-green-50"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" /> Pass
                </button>
                <button
                  onClick={() => setResults({ ...results, [cat.key]: "fail" })}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    results[cat.key] === "fail" ? "bg-red-50 text-red-700 border border-red-200" : "bg-neutral-50 text-neutral-500 hover:bg-red-50"
                  }`}
                >
                  <XCircle className="h-4 w-4" /> Needs Work
                </button>
              </div>
            </div>
          ))}
        </div>
        {Object.values(results).some((v) => v === "fail") && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            You have areas that need attention. Review and clean up those posts before starting your job search.
          </div>
        )}
      </section>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} size="lg">Save Audit Results</Button>
      </div>
    </div>
  );
}
