"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProfileForm } from "@/components/inputs/ProfileForm";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { WhatIfPanel } from "@/components/whatif/WhatIfPanel";
import { RelocationPanel } from "@/components/location/RelocationPanel";
import { useFireProfile } from "@/hooks/useFireProfile";
import { useFireCalculations } from "@/hooks/useFireCalculations";

type Tab = "inputs"|"results"|"whatif"|"relocate";
const TABS: {id:Tab;label:string}[] = [
  {id:"inputs",label:"My Profile"},{id:"results",label:"Results"},
  {id:"whatif",label:"What-If"},{id:"relocate",label:"Relocate"},
];

export default function FireApp() {
  const { profile, hydrate, updateProfile, resetProfile } = useFireProfile();
  const [activeTab, setActiveTab] = useState<Tab>("inputs");
  useEffect(() => { hydrate(); }, [hydrate]);
  const results = useFireCalculations(profile);
  return (
    <div className="min-h-screen">
      <Header onReset={resetProfile} />
      <div className="sticky top-[57px] z-30 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {TABS.map((tab)=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab===tab.id?"border-emerald-500 text-emerald-600 dark:text-emerald-400":"border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab==="inputs" && <ProfileForm profile={profile} onChange={updateProfile} onViewResults={()=>setActiveTab("results")} />}
        {activeTab==="results" && <ResultsDashboard results={results} profile={profile} />}
        {activeTab==="whatif" && <WhatIfPanel profile={profile} baseResults={results} />}
        {activeTab==="relocate" && <RelocationPanel profile={profile} baseResults={results} />}
      </main>
      <footer className="border-t border-[var(--border)] py-4 mt-8">
        <p className="text-center text-xs text-[var(--fg-muted)]">FIRE Calculator · Not financial advice · Data saved locally in your browser</p>
      </footer>
    </div>
  );
}
