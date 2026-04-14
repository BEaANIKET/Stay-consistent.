import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PendingRequests({ requests, onAccept }) {
  if (requests.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          Requests
        </span>
        <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-bold">
          {requests.length}
        </span>
      </div>
      {requests.map((req) => (
        <div
          key={req._id}
          className="flex items-center justify-between gap-3 p-4 bg-blue-500/[0.04] border border-blue-500/15 rounded-2xl"
        >
          <div>
            <p className="text-sm font-semibold text-white">{req.name}</p>
            <p className="text-xs text-white/35">{req.email}</p>
          </div>
          <Button size="sm" variant="success" onClick={() => onAccept(req._id)}>
            <Check size={13} /> Accept
          </Button>
        </div>
      ))}
    </section>
  );
}
