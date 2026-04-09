'use client';

import { useTransition } from 'react';
import { updateRunStatus, completeAndRecreateRun } from '@/app/actions/runs';

interface DriverRunActionsProps {
  runId: string;
  runStatus: 'scheduled' | 'in-progress';
}

export default function DriverRunActions({ runId, runStatus }: DriverRunActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    if (runStatus === 'scheduled') {
      startTransition(async () => {
        await updateRunStatus(runId, 'in-progress');
      });
    } else {
      const confirmed = window.confirm("이 경로 운행을 완료하시겠습니까?\\n다음 주 동일한 시간에 이 경로를 다시 생성할까요?\\n\\nOK: 다음 주 경로 자동 생성 (운행 완료)\\nCancel: 경로 생성하지 않음 (그냥 운행 완료)");
      
      startTransition(async () => {
        await completeAndRecreateRun(runId, confirmed);
      });
    }
  };

  return (
    <button
      onClick={handleAction}
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
  );
}
