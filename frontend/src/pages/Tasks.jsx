import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, deleteTask } from '@/api/tasks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { Plus, Shield, AlertTriangle } from 'lucide-react';
import TaskRow from '@/components/tasks/TaskRow';
import SummaryPills from '@/components/tasks/SummaryPills';
import TaskForm from '@/components/tasks/TaskForm';

const todayISO = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
};

const EMPTY_FORM = () => ({
  title:        '',
  type:         'positive',
  required:     true,
  scheduleType: 'daily',
  daysOfWeek:   [],
  startDate:    todayISO(),
  endDate:      '',
});

export default function Tasks() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM());

  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks().then((r) => r.data.tasks),
  });

  const { mutate: addTask, isPending: adding } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['todayLog'] });
      setShowModal(false);
      setForm(EMPTY_FORM());
      toast('Task added successfully', 'success');
    },
    onError: (err) => toast(err.response?.data?.message || 'Failed to add task', 'error'),
  });

  const { mutate: removeTask } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast('Task removed', 'info');
    },
  });

  const tasks    = data || [];
  const positive = tasks.filter((t) => t.type === 'positive');
  const negative = tasks.filter((t) => t.type === 'negative');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({
      title:        form.title.trim(),
      type:         form.type,
      required:     form.required,
      scheduleType: form.scheduleType,
      daysOfWeek:   form.daysOfWeek,
      startDate:    form.startDate || todayISO(),
      endDate:      form.endDate || undefined,
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM());
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-sm text-white/35 mt-1">Manage your daily disciplines</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="hidden sm:inline-flex">
          <Plus size={15} /> Add Task
        </Button>
      </div>

      <SummaryPills
        total={tasks.length}
        positiveCount={positive.length}
        negativeCount={negative.length}
      />

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/2 rounded-2xl border border-white/4 animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-14 h-14 bg-white/3 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={24} className="text-white/15" />
          </div>
          <p className="text-sm font-semibold text-white/40">No tasks yet</p>
          <p className="text-xs text-white/20 mt-1 mb-5">Add your first discipline task to begin tracking.</p>
          <Button onClick={() => setShowModal(true)} className="mx-auto">
            <Plus size={14} /> Add First Task
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {positive.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Positive Habits</span>
                <span className="text-xs text-white/20 ml-auto">{positive.length}</span>
              </div>
              <div className="space-y-2">
                {positive.map((task) => (
                  <TaskRow key={task._id} task={task} onDelete={removeTask} />
                ))}
              </div>
            </section>
          )}

          {negative.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Habit Control</span>
                <span className="text-xs text-white/20 ml-auto">{negative.length}</span>
              </div>
              <div className="flex items-start gap-2.5 bg-orange-500/5 border border-orange-500/15 rounded-2xl p-3.5 mb-2.5">
                <AlertTriangle size={13} className="text-orange-400/70 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-400/60 leading-relaxed">
                  Mark <strong className="text-orange-400">Done</strong> when you maintained control.
                  A relapse is marked as <strong className="text-red-400">Failed</strong> and is permanently recorded.
                </p>
              </div>
              <div className="space-y-2">
                {negative.map((task) => (
                  <TaskRow key={task._id} task={task} onDelete={removeTask} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="sm:hidden fixed bottom-24 right-6 w-14 h-14 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-full shadow-xl shadow-violet-600/30 flex items-center justify-center transition-all active:scale-90 z-30"
      >
        <Plus size={22} />
      </button>

      <TaskForm
        open={showModal}
        onClose={closeModal}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        adding={adding}
      />
    </div>
  );
}
