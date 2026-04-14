export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#1a1a1a]/95 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-xl">
      <p className="text-white/40 font-medium mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}
