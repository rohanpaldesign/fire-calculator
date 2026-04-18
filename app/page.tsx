"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { WhatIfPanel } from "@/components/whatif/WhatIfPanel";
import { RelocationPanel } from "@/components/location/RelocationPanel";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { useFireProfile } from "@/hooks/useFireProfile";
import { useFireCalculations } from "@/hooks/useFireCalculations";

type Tab = "results" | "whatif" | "relocate";
const TABS: { id: Tab; label: string }[] = [
  { id: "results", label: "Results" },
  { id: "whatif", label: "What-If" },
  { id: "relocate", label: "Relocate" },
];

export default function FireApp() {
  const { profile, hydrate, updateProfile, resetProfile, hydrated, isSetupComplete, markSetupComplete } = useFireProfile();
  const [activeTab, setActiveTab] = useState<Tab>("results");
  const [showWizard, setShowWizard] = useState(false);
  useEffect(() => { hydrate(); }, [hydrate]);
  const results = useFireCalculations(profile);

  return (
    <div className="min-h-screen">
      <Header onReset={resetProfile} />

      {/* Tab navigation — only show when setup is complete */}
      {isSetupComplete && (
        <div className="sticky top-[57px] z-30 border-b border-[var(--border)] bg-[var(--bg)]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* First-time landing */}
        {hydrated && !isSetupComplete && !showWizard && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <h1 className="text-3xl font-bold text-[var(--fg)]">Plan your FIRE journey</h1>
            <p className="text-[var(--fg-muted)] max-w-sm">
              Answer a few questions about your finances and we&apos;ll show you exactly when you can retire.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base transition-colors"
            >
              Get Started →
            </button>
          </div>
        )}

        {/* Results view */}
        {hydrated && isSetupComplete && (
          <>
            {activeTab === "results" && (
              <ResultsDashboard
                results={results}
                profile={profile}
                onChange={updateProfile}
                onEditAll={() => setShowWizard(true)}
              />
            )}
            {activeTab === "whatif" && <WhatIfPanel profile={profile} baseResults={results} />}
            {activeTab === "relocate" && <RelocationPanel profile={profile} baseResults={results} />}
          </>
        )}

      </main>

      {/* Wizard modal */}
      {showWizard && (
        <SetupWizard
          profile={profile}
          onChange={updateProfile}
          isFirstTime={!isSetupComplete}
          onComplete={() => {
            markSetupComplete();
            setShowWizard(false);
          }}
          onClose={isSetupComplete ? () => setShowWizard(false) : undefined}
        />
      )}

      <footer className="border-t border-[var(--border)] py-4 mt-8">
        <p className="text-center text-xs text-[var(--fg-muted)]">
          FIRE Calculator · Not financial advice · All data stays in your browser
        </p>
      </footer>
    </div>
  );
}
