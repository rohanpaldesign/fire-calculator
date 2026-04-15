"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from "recharts";
import type { PortfolioDataPoint } from "@/types/fire";
import { formatCurrency } from "@/lib/formatters";
interface Props { data: PortfolioDataPoint[]; fireDate: Date|null; coastFireAchievedAge: number|null; currentAge: number; }
const CustomTooltip = ({ active, payload, label }: { active?:boolean; payload?:Array<{name:string;value:number;color:string}>; label?:number }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-lg text-xs">
      <p className="font-semibold text-[var(--fg)] mb-1">Age {label}</p>
      {payload.map((e)=><p key={e.name} style={{color:e.color}}>{e.name}: {formatCurrency(e.value,true)}</p>)}
    </div>
  );
};
export default function PortfolioChart({ data, coastFireAchievedAge, currentAge }: Props) {
  const firePoint = data.find((d)=>d.portfolioValue>=d.fireTarget);
  const coastPoint = coastFireAchievedAge ? data.find((d)=>d.age===coastFireAchievedAge) : null;
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-wide">Portfolio Growth Projection</h3>
        {firePoint && <p className="text-xs text-[var(--fg-muted)] mt-0.5">Hits FIRE target at age {firePoint.age} ({firePoint.year}){coastPoint?` · Coast FIRE at age ${coastPoint.age}`:""}</p>}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{top:5,right:5,bottom:5,left:10}}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis dataKey="age" tick={{fontSize:11,fill:"var(--fg-muted)"}} />
          <YAxis tickFormatter={(v)=>formatCurrency(v,true)} tick={{fontSize:11,fill:"var(--fg-muted)"}} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{fontSize:"11px",paddingTop:"8px"}} />
          <Line type="monotone" dataKey="portfolioValue" name="Portfolio" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{r:4,fill:"#10b981"}} />
          <Line type="monotone" dataKey="fireTarget" name="FIRE Target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
          <Line type="monotone" dataKey="coastFireTarget" name="Coast FIRE" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
          <ReferenceLine x={currentAge} stroke="var(--fg-muted)" strokeDasharray="2 2" label={{value:"Now",fontSize:10,fill:"var(--fg-muted)"}} />
          {firePoint && <ReferenceLine x={firePoint.age} stroke="#10b981" strokeDasharray="4 2" label={{value:"FIRE!",fontSize:10,fill:"#10b981",position:"top"}} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
