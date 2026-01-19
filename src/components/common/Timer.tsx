import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

interface TimerProps {
  onComplete: (seconds: number) => void;
  goalMinutes?: number;
}

const Timer: React.FC<TimerProps> = ({ onComplete, goalMinutes = 30 }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  const handleStop = () => {
    setIsRunning(false);
    onComplete(elapsedSeconds);
  };

  const progress = goalMinutes ? Math.min((elapsedSeconds / (goalMinutes * 60)) * 100, 100) : 0;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const isGoalReached = goalMinutes && elapsedMinutes >= goalMinutes;

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Circular Progress Background */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-bg-tertiary-light dark:text-bg-tertiary-dark"
            />

            {/* Progress circle */}
            {goalMinutes && (
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke={isGoalReached ? '#34C759' : '#007AFF'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                transition={{ duration: 0.5 }}
                style={{
                  strokeDasharray: 553,
                }}
              />
            )}
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tabular-nums">
              {formatTime(elapsedSeconds)}
            </div>
            {goalMinutes && (
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Goal: {goalMinutes} min
              </div>
            )}
            {isGoalReached && (
              <div className="text-sm text-success font-medium mt-1">
                ✓ Goal reached!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <Button
          variant={isRunning ? 'secondary' : 'primary'}
          onClick={handleStartPause}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <>
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {elapsedSeconds > 0 ? 'Resume' : 'Start'}
            </>
          )}
        </Button>

        {elapsedSeconds > 0 && (
          <>
            <Button variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={handleStop}
              className="min-w-[120px]"
            >
              Stop & Save
            </Button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
        {isRunning && 'Timer is running in the background'}
        {!isRunning && elapsedSeconds === 0 && 'Press Start to begin timing'}
      </div>
    </div>
  );
};

export default Timer;
