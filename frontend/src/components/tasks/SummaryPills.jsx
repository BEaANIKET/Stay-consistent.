import { Shield, CheckCircle2, XCircle } from 'lucide-react';

export default function SummaryPills({ total, positiveCount, negativeCount }) {
  if (total === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-xs text-white/50">
        <Shield size={11} /> {total} total
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/8 border border-blue-500/15 text-xs text-blue-400">
        <CheckCircle2 size={11} /> {positiveCount} positive habits
      </span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/8 border border-orange-500/15 text-xs text-orange-400">
        <XCircle size={11} /> {negativeCount} habit controls
      </span>
    </div>
  );
}
