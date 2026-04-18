"use client";
import { useEffect, useState } from "react";
import { Header, type AppTab } from "@/components/layout/Header";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { WhatIfPanel } from "@/components/whatif/WhatIfPanel";
import { RelocationPanel } from "@/components/location/RelocationPanel";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { useFireProfile } from "@/hooks/useFireProfile";
import { useFireCalculations } from "@/hooks/useFireCalculations";

export default function FireApp() {
  const { profile, hydrate, updateProfile, resetProfile, hydrated, isSetupComplete, markSetupComplete } = useFireProfile();
  const [activeTab, setActiveTab] = useState<AppTab>("results");
  const [showWizard, setShowWizard] = useState(false);
  useEffect(() => { hydrate(); }, [hydrate]);
  const results = useFireCalculations(profile);

  return (
    <div className="min-h-screen">
      <Header
        onReset={resetProfile}
        showTabs={isSetupComplete}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
