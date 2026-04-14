import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFriends, sendFriendRequest, acceptFriendRequest } from '@/api/friends';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { Users, UserPlus } from 'lucide-react';
import FriendCard from '@/components/friends/FriendCard';
import PendingRequests from '@/components/friends/PendingRequests';
import AddFriendModal from '@/components/friends/AddFriendModal';

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

  const friends  = data?.friends  || [];
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

      <PendingRequests requests={requests} onAccept={acceptRequest} />

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
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-white/2 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : friends.length === 0 ? (
          <Card className="text-center py-14">
            <div className="w-12 h-12 bg-white/3 rounded-2xl flex items-center justify-center mx-auto mb-4">
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

      <AddFriendModal
        open={showModal}
        onClose={() => setShowModal(false)}
        email={email}
        setEmail={setEmail}
        onSubmit={(e) => { e.preventDefault(); sendRequest(); }}
        sending={sending}
      />
    </div>
  );
}
