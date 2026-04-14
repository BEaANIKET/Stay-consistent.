export default function ScoreBar({ score }) {
  const pct = Math.min(100, Math.max(0, (score / 200) * 100));
  const color = score >= 100 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
