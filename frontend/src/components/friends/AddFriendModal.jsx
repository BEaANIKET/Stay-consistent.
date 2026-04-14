import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AddFriendModal({ open, onClose, email, setEmail, onSubmit, sending }) {
  return (
    <Modal open={open} onClose={onClose} title="Add Accountability Partner">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={sending} className="flex-1">
            {sending ? 'Sending…' : 'Send Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
