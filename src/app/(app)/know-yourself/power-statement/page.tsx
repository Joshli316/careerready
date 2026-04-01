"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SavedIndicator } from "@/components/ui/SavedIndicator";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Mic } from "lucide-react";

export default function PowerStatementPage() {
  const { saved, save, storage } = useProfileSave();
  const { t } = useLanguage();
  const [powerStatement, setPowerStatement] = useState("");
  const [brandStatement, setBrandStatement] = useState("");

  useEffect(() => {
    storage.getProfile().then((profile) => {
      if (profile?.powerStatement) setPowerStatement(profile.powerStatement);
      if (profile?.brandStatement) setBrandStatement(profile.brandStatement);
    });
  }, [storage]);

  const handleSave = useCallback(() => save({ powerStatement }), [save, powerStatement]);

  return (
    <div>
      <Breadcrumb href="/know-yourself" label={t("knowYourself.title")} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("knowYourself.powerStatement.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {t("knowYourself.powerStatement.description")}
          </p>
        </div>
        <SavedIndicator visible={saved} />
      </div>

      <Callout type="tip" className="mb-6">
        {t("knowYourself.powerStatement.callout")}
      </Callout>

      {/* Tips */}
      <section className="mb-6 rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-neutral-800">{t("knowYourself.powerStatement.whatToInclude")}</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> {t("knowYourself.powerStatement.tip1")}</li>
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> {t("knowYourself.powerStatement.tip2")}</li>
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> {t("knowYourself.powerStatement.tip3")}</li>
          <li className="flex gap-2"><span className="text-primary-400">&#10003;</span> {t("knowYourself.powerStatement.tip4")}</li>
        </ul>
      </section>

      {/* Brand statement reference */}
      {brandStatement && (
        <div className="mb-6 rounded-lg border border-primary-100 bg-primary-50 p-4">
          <div className="mb-1 text-xs font-medium text-primary-600">{t("knowYourself.powerStatement.brandRef")}</div>
          <p className="text-sm text-primary-800 italic">&ldquo;{brandStatement}&rdquo;</p>
        </div>
      )}

      {/* Example */}
      <div className="mb-6 rounded-lg border border-neutral-150 bg-neutral-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-neutral-600">{t("knowYourself.powerStatement.exampleTitle")}</h3>
        <p className="text-sm text-neutral-500 italic">
          {t("knowYourself.powerStatement.exampleText")}
        </p>
      </div>

      {/* Power Statement Builder */}
      <section className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-6">
        <div className="mb-3 flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary-600" />
          <h2 className="font-semibold text-primary-800">{t("knowYourself.powerStatement.yourPowerStatement")}</h2>
        </div>
        <Textarea
          placeholder={t("knowYourself.powerStatement.placeholder")}
          value={powerStatement}
          onChange={(e) => setPowerStatement(e.target.value)}
          rows={6}
          className="border-primary-200 bg-white"
        />
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">{t("knowYourself.powerStatement.savePowerStatement")}</Button>
      </div>
    </div>
  );
}
