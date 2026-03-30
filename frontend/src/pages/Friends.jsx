import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFriends, sendFriendRequest, acceptFriendRequest } from '@/api/friends';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { Users, UserPlus, Flame, Trophy, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_MAP = {
  completed: { label: 'Completed', cls: 'text-green-400 bg-green-500/8 border-green-500/20' },
  failed:    { label: 'Failed',    cls: 'text-red-400   bg-red-500/8   border-red-500/20'   },
  partial:   { label: 'Partial',   cls: 'text-yellow-400 bg-yellow-500/8 border-yellow-500/20' },
  pending:   { label: 'Pending',   cls: 'text-white/30  bg-white/5     border-white/10'    },
  'no-data': { label: '—',         cls: 'text-white/15  bg-transparent border-transparent' },
};

function FriendCard({ friend }) {
  const status = STATUS_MAP[friend.todayStatus] ?? STATUS_MAP['no-data'];
  const initials = friend.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const scoreColor = friend.disciplineScore >= 100 ? 'text-green-400' : friend.disciplineScore >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-4 p-4 md:p-5 bg-[#111] border border-white/[0.06] rounded-2xl hover:border-white/12 transition-all group">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center text-sm font-bold text-white/70 shrink-0">
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{friend.name}</p>
        <p className="text-xs text-white/30 truncate">{friend.email}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Flame size={11} className="text-orange-400" />
            <span className="font-semibold text-white/70">{friend.currentStreak}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <Zap size={11} className="text-yellow-500/50" />
            <span className={cn('font-semibold', scoreColor)}>{friend.disciplineScore}</span>
          </div>
        </div>

        <span className={cn(
          'text-[10px] font-semibold px-2.5 py-1 rounded-full border',
          status.cls
        )}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

export default function Friends() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriends().then((r) => r.data),
  });

  const { mutate: sendRequest, isPending: sending } = useMutation({
    mutationFn: () => sendFriendRequest(email),
    onSuccess: () => {
      setShowModal(false);
      setEmail('');
      toast('Friend request sent', 'success');
    },
    onError: (err) => toast(err.response?.data?.message || 'Failed to send request', 'error'),
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast('Accountability partner added', 'success');
    },
  });

  const friends = data?.friends || [];
  const requests = data?.requests || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Friends</h1>
          <p className="text-sm text-white/35 mt-1">Private accountability partners</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <UserPlus size={15} /> Add Friend
        </Button>
      </div>

      {/* Pending requests */}
      {requests.length > 0 && (
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
              <Button size="sm" variant="success" onClick={() => acceptRequest(req._id)}>
                <Check size={13} /> Accept
              </Button>
            </div>
          ))}
        </section>
      )}

      {/* Friends list */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
            Accountability Partners
          </span>
          <span className="text-xs text-white/20">{friends.length}</span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1,2].map(i => <div key={i} className="h-16 bg-white/[0.02] rounded-2xl animate-pulse" />)}
          </div>
        ) : friends.length === 0 ? (
          <Card className="text-center py-14">
            <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={20} className="text-white/15" />
            </div>
            <p className="text-sm font-semibold text-white/35">No partners yet</p>
            <p className="text-xs text-white/20 mt-1 mb-5">
              Add a friend to see their discipline stats.
            </p>
            <Button onClick={() => setShowModal(true)} className="mx-auto">
              <UserPlus size={14} /> Add Friend
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </section>

      {/* Add friend modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Accountability Partner">
        <form onSubmit={(e) => { e.preventDefault(); sendRequest(); }} className="flex flex-col gap-4">
          <Input
            label="Friend's Email"
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <p className="text-xs text-white/25 leading-relaxed">
            They will receive a request and must accept before you can see their data.
            No public leaderboard — this is between you.
          </p>
          <div className="flex gap-2 mt-1">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={sending} className="flex-1">
              {sending ? 'Sending…' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
