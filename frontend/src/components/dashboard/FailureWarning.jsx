import { AlertTriangle } from 'lucide-react';

export default function FailureWarning({ failed }) {
  if (failed === 0) return null;

  return (
    <div className="flex items-start gap-3 bg-danger-muted border border-danger-border rounded-2xl p-4 pulse-danger">
      <div className="w-8 h-8 bg-danger-muted border border-danger-border rounded-xl flex items-center justify-center shrink-0">
        <AlertTriangle size={15} className="text-danger-text" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-danger-text">You broke your discipline.</p>
        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
          {failed} task{failed > 1 ? 's' : ''} failed today — −{failed * 10} discipline points deducted.{' '}
          <span className="text-text-secondary">Get back on track tomorrow.</span>
        </p>
      </div>
    </div>
  );
}
