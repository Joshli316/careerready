"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Callout } from "@/components/ui/Callout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function EmailGuidePage() {
  const { t } = useLanguage();

  return (
    <div>
      <Breadcrumb href="/resumes" label={t("resumes.title")} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("resumes.emailGuide.title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {t("resumes.emailGuide.description")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">1</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.subjectLine")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.subjectDesc")}
              </p>
              <div className="mt-2 rounded-lg bg-neutral-50 p-3 font-mono text-sm text-neutral-700">
                {t("resumes.emailGuide.subjectExample")}
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">2</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.emailBody")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.emailBodyDesc")}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>{t("resumes.emailGuide.emailTip1")}</li>
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>{t("resumes.emailGuide.emailTip2")}</li>
                <li className="flex gap-2"><span className="text-primary-400">&#10003;</span>{t("resumes.emailGuide.emailTip3")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">3</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.contactInfo")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.contactInfoDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="rounded-xl border-l-4 border-l-primary-400 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-400 text-sm font-bold text-white">4</div>
            <div>
              <h2 className="font-semibold text-neutral-800">{t("resumes.emailGuide.attachments")}</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t("resumes.emailGuide.attachmentsDesc")}
              </p>
              <div className="mt-2 space-y-1 rounded-lg bg-neutral-50 p-3 font-mono text-sm text-neutral-700">
                <div>{t("resumes.emailGuide.attachmentResume")}</div>
                <div>{t("resumes.emailGuide.attachmentCover")}</div>
              </div>
            </div>
          </div>
        </section>

        <Callout type="warning">
          {t("resumes.emailGuide.proofreadWarning")}
        </Callout>

        {/* Sample email */}
        <section className="rounded-xl border border-neutral-150 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">{t("resumes.emailGuide.sampleEmail")}</h2>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
            <div className="mb-2 border-b border-neutral-200 pb-2">
              <div><strong>To:</strong> hiring@company.com</div>
              <div><strong>{t("resumes.emailGuide.subjectLine")}:</strong> {t("resumes.emailGuide.sampleSubject").replace("Subject: ", "")}</div>
            </div>
            <p>{t("resumes.emailGuide.sampleGreeting")}</p>
            <br />
            <p>
              {t("resumes.emailGuide.sampleBody")}
            </p>
            <br />
            <p>
              {t("resumes.emailGuide.sampleClosing")}
            </p>
            <br />
            <p>{t("common.sincerely")}</p>
            <p>{t("resumes.emailGuide.sampleName")}</p>
            <p>{t("resumes.emailGuide.samplePhone")}</p>
            <p>{t("resumes.emailGuide.sampleEmail2")}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
