'use client';

import { useState, useTransition } from 'react';
import { updateRunStatus, completeAndRecreateRun } from '@/app/actions/runs';

interface DriverRunActionsProps {
  runId: string;
  runStatus: 'scheduled' | 'in-progress';
}

export default function DriverRunActions({ runId, runStatus }: DriverRunActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);

  const handleStart = () => {
    startTransition(async () => {
      await updateRunStatus(runId, 'in-progress');
    });
  };

  const handleCompleteChoice = (scheduleNextWeek: boolean) => {
    setShowModal(false);
    startTransition(async () => {
      await completeAndRecreateRun(runId, scheduleNextWeek);
    });
  };

  return (
    <>
      <button
        onClick={() => runStatus === 'scheduled' ? handleStart() : setShowModal(true)}
        disabled={isPending}
        className={`btn-active w-full h-12 font-bold rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 text-on-primary ${
          isPending ? 'opacity-70 cursor-not-allowed' : ''
        } ${runStatus === 'scheduled' ? 'bg-primary' : 'bg-secondary'}`}
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
          {runStatus === 'scheduled' ? 'play_arrow' : 'stop'}
        </span>
        {isPending
          ? 'Processing...'
          : runStatus === 'scheduled'
          ? 'Start Run'
          : 'Complete Run'}
      </button>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-on-surface">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined">event_repeat</span>
              </div>
              <h3 className="text-lg font-bold">Route Complete!</h3>
            </div>
            
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Would you like to automatically create and schedule this exact same route for next week?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleCompleteChoice(true)}
                className="w-full h-12 bg-primary text-on-primary font-bold rounded-2xl shadow-sm text-sm flex items-center justify-center hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                Yes, schedule for next week
              </button>
              <button
                onClick={() => handleCompleteChoice(false)}
                className="w-full h-12 bg-surface-container text-on-surface font-bold rounded-2xl shadow-sm text-sm flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-[0.98]"
              >
                No, just finish run
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full h-10 text-on-surface-variant font-semibold text-xs flex items-center justify-center mt-2 decoration-transparent hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
