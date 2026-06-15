'use client';

import { useEffect, useState } from 'react';

interface XPProgressBarProps {
  current: number;
  target: number;
  percent: number;
  levelName: string;
  nextLevelName: string;
  xpNeeded: number;
}

export default function XPProgressBar({
  current,
  target,
  percent,
  levelName,
  nextLevelName,
  xpNeeded,
}: XPProgressBarProps) {
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayPercent(percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{levelName}</span>
        <span className="text-gray-600">{current.toLocaleString()} / {target.toLocaleString()} XP</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${displayPercent}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">
        {xpNeeded.toLocaleString()} XP needed to reach {nextLevelName}
      </p>
    </div>
  );
}
