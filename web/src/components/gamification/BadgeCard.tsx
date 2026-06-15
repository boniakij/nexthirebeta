'use client';

interface BadgeCardProps {
  name: string;
  description: string;
  iconUrl?: string;
  xpReward: number;
  isUnlocked: boolean;
  currentProgress?: { current: number; target: number };
}

export default function BadgeCard({
  name,
  description,
  iconUrl,
  xpReward,
  isUnlocked,
  currentProgress,
}: BadgeCardProps) {
  const progressPercent = currentProgress
    ? Math.round((currentProgress.current / currentProgress.target) * 100)
    : 0;

  return (
    <div className={`rounded-lg border-2 p-4 transition-all ${
      isUnlocked
        ? 'border-primary-200 bg-primary-50'
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
          isUnlocked ? 'bg-primary-100' : 'bg-gray-200'
        }`}>
          {iconUrl ? <img src={iconUrl} alt={name} /> : '🏆'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{name}</h3>
            {isUnlocked && <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded">+{xpReward} XP</span>}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          {currentProgress && !isUnlocked && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{currentProgress.current} / {currentProgress.target}</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-primary-500 h-full rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
