"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { COL_DATA_UNIQUE } from "@/lib/cost-of-living";
import type { FireProfile, USState } from "@/types/fire";
interface Props { profile: FireProfile; onChange: (patch: Partial<FireProfile>) => void; }
export function PersonalSection({ profile, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-[var(--fg)]">Personal</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentAge">Current Age</Label>
          <Input id="currentAge" type="number" min={18} max={80} value={profile.currentAge} onChange={(e) => onChange({ currentAge: parseInt(e.target.value)||30 })} />
        </div>
        <div>
          <Label htmlFor="retirementAge">Target Retirement Age</Label>
          <Input id="retirementAge" type="number" min={profile.currentAge+1} max={90} value={profile.retirementAge} onChange={(e) => onChange({ retirementAge: parseInt(e.target.value)||65 })} />
        </div>
      </div>
      <div>
        <Label htmlFor="location">State / Location</Label>
        <Select value={profile.location} onValueChange={(v) => onChange({ location: v as USState })}>
          <SelectTrigger id="location"><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent>
            {COL_DATA_UNIQUE.map((s) => (
              <SelectItem key={s.state} value={s.state}>{s.name} ({s.state}) — CoL {s.colIndex.toFixed(0)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-[var(--fg-muted)] mt-1">Used to compare cost-of-living across states in the Relocate tab.</p>
      </div>
    </div>
  );
}
