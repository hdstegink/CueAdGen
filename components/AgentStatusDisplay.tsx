
import React, { useEffect, useRef, useState } from 'react';
import { AgentStatus } from '../types';
import { Search, Database, PenTool, CheckCircle2 } from 'lucide-react';

interface Props {
  status: AgentStatus;
  message: string;
}

const AgentStatusDisplay: React.FC<Props> = ({ status, message }) => {
  const steps = [
    { id: AgentStatus.Researching, label: 'Websiteonderzoek', icon: Search, color: '#783C96' },
    { id: AgentStatus.Retrieving, label: 'Inspiratie selecteren', icon: Database, color: '#D23278' },
    { id: AgentStatus.Writing, label: 'Scripts schrijven', icon: PenTool, color: '#E6463C' },
  ];

  const getCurrentStepIndex = () => {
    switch(status) {
        case AgentStatus.Researching: return 0;
        case AgentStatus.Retrieving: return 1;
        case AgentStatus.Writing: return 2;
        case AgentStatus.Completed: return 3;
        default: return -1;
    }
  };

  const activeIndex = getCurrentStepIndex();
  const currentMessage = useRef(message);
  const [previousMessage, setPreviousMessage] = useState('');
  const [visibleMessage, setVisibleMessage] = useState(message);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (!message || message === currentMessage.current) return;
    const previous = currentMessage.current;
    currentMessage.current = message;
    setVisibleMessage(message);
    if (!previous) return;

    setPreviousMessage(previous);
    setIsRolling(false);
    const frame = requestAnimationFrame(() => setIsRolling(true));
    const resetTimer = setTimeout(() => {
      setPreviousMessage('');
      setIsRolling(false);
    }, 500);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resetTimer);
    };
  }, [message]);

  if (status === AgentStatus.Idle || status === AgentStatus.Error) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-12">
      {/* 
        Container Padding (px-4 = 16px)
        Item Wrapper Padding (p-2 = 8px)
        Circle Width (w-14 = 56px) -> Radius = 28px
        Center of circle relative to Container left edge = 16px + 8px + 28px = 52px.
        So the lines must start and end at 52px from the edges.
      */}
      <div className="relative flex justify-between items-center px-4">
        
        {/* Progress Track Container */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -z-20 px-[52px] box-border">
            <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#783C96] to-[#E6463C] transition-all duration-700 ease-in-out"
                    style={{ width: `${Math.min((activeIndex / 2) * 100, 100)}%`}}
                ></div>
            </div>
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3 relative bg-white/50 backdrop-blur-sm p-2 rounded-xl">
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-sm z-10 ${
                    isActive || isCompleted ? 'scale-110 bg-white' : 'bg-gray-50 border-gray-200 text-gray-300'
                }`}
                style={{ 
                    borderColor: isActive || isCompleted ? step.color : undefined,
                    color: isActive || isCompleted ? step.color : undefined
                }}
              >
                 {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />}
              </div>
              
              {/* Text Label - Absolute Centered below icon */}
              <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 absolute -bottom-8 w-40 text-center left-1/2 -translate-x-1/2 ${
                isActive ? 'text-black' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {!!message && (
        <div className="mt-14 flex justify-center px-4" role="status" aria-live="polite" aria-atomic="true">
          <div className="h-6 max-w-full overflow-hidden text-center text-xs font-medium text-gray-500">
            <div
              className={`flex flex-col transition-transform duration-500 ease-out motion-reduce:transition-none ${isRolling ? '-translate-y-6' : 'translate-y-0'}`}
            >
              {previousMessage && <p className="flex h-6 shrink-0 items-center justify-center whitespace-nowrap px-2">{previousMessage}</p>}
              <p className="flex h-6 shrink-0 items-center justify-center whitespace-nowrap px-2">{visibleMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentStatusDisplay;
