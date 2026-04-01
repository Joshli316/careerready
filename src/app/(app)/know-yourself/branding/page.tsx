"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Sparkles } from "lucide-react";

export default function BrandingPage() {
  const { saved, save, storage } = useProfileSave();
  const { t } = useLanguage();
  const [field, setField] = useState("");
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [brandStatement, setBrandStatement] = useState("");

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.brandStatement) setBrandStatement(profile.brandStatement);
      const bd = profile?.brandDiscovery;
      if (bd) {
        if (bd.field) setField(bd.field);
        if (bd.position) setPosition(bd.position);
        if (bd.skills) setSkills(bd.skills);
        if (bd.accomplishments) setAccomplishments(bd.accomplishments);
      }
    });
  }, [storage]);

  const handleSave = useCallback(
    () => save({ brandStatement, brandDiscovery: { field, position, skills, accomplishments } }),
    [save, brandStatement, field, position, skills, accomplishments]
  );

  return (
    <div>
      <Breadcrumb href="/know-yourself" label={t("knowYourself.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("knowYourself.branding.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("knowYourself.branding.description")}
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("knowYourself.branding.callout")}
      </Callout>

      {/* Discovery */}
      <section className="mb-6 rounded-xl border-l-4 border-l-primary-400 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800">{t("knowYourself.branding.identifyTitle")}</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t("knowYourself.branding.fieldLabel")} placeholder={t("knowYourself.branding.fieldPlaceholder")} value={field} onChange={(e) => setField(e.target.value)} />
            <Input label={t("knowYourself.branding.positionLabel")} placeholder={t("knowYourself.branding.positionPlaceholder")} value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>
          <Textarea label={t("knowYourself.branding.skillsLabel")} placeholder={t("knowYourself.branding.skillsPlaceholder")} value={skills} onChange={(e) => setSkills(e.target.value)} rows={3} />
          <Textarea label={t("knowYourself.branding.accomplishmentsLabel")} placeholder={t("knowYourself.branding.accomplishmentsPlaceholder")} value={accomplishments} onChange={(e) => setAccomplishments(e.target.value)} rows={3} />
        </div>
      </section>

      {/* Brand Statement */}
      <section className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          <h2 className="font-semibold text-primary-800">{t("knowYourself.branding.statementTitle")}</h2>
        </div>
        <p className="mb-3 text-sm text-primary-700">
          {t("knowYourself.branding.statementDesc")}
        </p>
        <Textarea
          placeholder={t("knowYourself.branding.statementPlaceholder")}
          value={brandStatement}
          onChange={(e) => setBrandStatement(e.target.value)}
          rows={4}
          className="border-primary-200 bg-white"
        />
      </section>

      {/* Example */}
      <div className="mb-6 rounded-lg border border-neutral-150 bg-neutral-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-neutral-600">{t("knowYourself.branding.exampleTitle")}</h3>
        <ul className="space-y-2 text-sm text-neutral-500 italic">
          <li>{t("knowYourself.branding.example1")}</li>
          <li>{t("knowYourself.branding.example2")}</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">{t("knowYourself.branding.saveBrand")}</Button>
      </div>
    </div>
  );
}
