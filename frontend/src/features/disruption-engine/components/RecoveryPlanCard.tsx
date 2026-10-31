import { CheckCircle2, CircleAlert, Coins, GitFork, ShieldCheck } from 'lucide-react';
import type { RecoveryPlan } from '../types/disruption.types';

interface RecoveryPlanCardProps {
  plan: RecoveryPlan;
  selected: boolean;
  onSelect: () => void;
}

const strategyName = (strategy: string) => strategy.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function RecoveryPlanCard({ plan, selected, onSelect }: RecoveryPlanCardProps) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} className="flex h-full w-full flex-col rounded-2xl p-4 text-left transition hover:-translate-y-0.5 sm:p-5" style={{
      background: selected ? 'linear-gradient(155deg, #fffdf9, #f8efe2)' : 'var(--warm-white)',
      border: `1px solid ${selected ? 'var(--gold)' : 'var(--border)'}`,
      boxShadow: selected ? 'var(--shadow-gold)' : 'var(--shadow-xs)',
    }}>
      <div className="flex w-full items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--gold-muted)' }}>Recovery option</span>
          <h3 className="mt-1 font-display text-xl font-semibold capitalize leading-tight" style={{ color: 'var(--text-ink)' }}>{strategyName(plan.strategy)}</h3>
        </div>
        {plan.feasible
          ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: 'rgba(57,119,82,0.10)', color: '#397752' }}><CheckCircle2 className="h-3.5 w-3.5" /> Feasible</span>
          : <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: 'rgba(160,120,132,0.12)', color: 'var(--rose-deep)' }}><CircleAlert className="h-3.5 w-3.5" /> Not feasible</span>}
      </div>
      <p className="mt-3 min-h-10 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{plan.impact_summary || 'No impact summary provided.'}</p>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <div className="rounded-xl p-2.5" style={{ background: 'var(--ivory)' }}>
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}><Coins className="h-3 w-3" /> Additional cost</p>
          <p className="mt-1 text-sm font-bold" style={{ color: 'var(--text-ink)' }}>₹{Number(plan.estimated_additional_cost || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: 'var(--ivory)' }}>
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}><GitFork className="h-3 w-3" /> Events moved</p>
          <p className="mt-1 text-sm font-bold" style={{ color: 'var(--text-ink)' }}>{plan.changed_event_count}</p>
        </div>
      </div>
      {plan.validation.errors?.length > 0 && (
        <div className="mt-3 flex items-start gap-1.5 text-left text-[11px] leading-relaxed" style={{ color: 'var(--rose-deep)' }}>
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {plan.validation.errors.join(' · ')}
        </div>
      )}
      <span className="sr-only">{selected ? 'Selected recovery option' : 'Select recovery option'}</span>
    </button>
  );
}
