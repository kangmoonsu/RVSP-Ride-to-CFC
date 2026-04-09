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

      {/* Toast UI Settings */}
      {showModal && (
        <div className="fixed bottom-20 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="bg-surface-container-high text-on-surface p-4 rounded-3xl shadow-xl border border-outline-variant/10 w-full max-w-sm pointer-events-auto">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">event_repeat</span>
              </div>
              <div>
                <h3 className="text-base font-bold">Route Completed</h3>
                <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                  Automatically create and schedule this exact same route for next week?
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleCompleteChoice(false)}
                className="flex-1 h-10 bg-surface-container-lowest text-on-surface font-bold rounded-2xl shadow-sm border border-outline-variant/20 text-xs flex items-center justify-center hover:bg-surface-container transition-colors active:scale-95"
              >
                No, just finish
              </button>
              <button
                onClick={() => handleCompleteChoice(true)}
                className="flex-1 h-10 bg-primary text-on-primary font-bold rounded-2xl shadow-sm text-xs flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95"
              >
                Yes, schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
