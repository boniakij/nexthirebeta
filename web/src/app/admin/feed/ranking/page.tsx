'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';

interface RankingRule {
  latest_weight: number;
  rating_weight: number;
  session_count_weight: number;
  availability_weight: number;
  featured_weight: number;
  boost_featured: boolean;
  boost_available: boolean;
  hide_no_availability: boolean;
  hide_suspended: boolean;
  hide_rejected: boolean;
  show_country_flag: boolean;
}

export default function AdminFeedRanking() {
  const [rules, setRules] = useState<RankingRule>({
    latest_weight: 30,
    rating_weight: 25,
    session_count_weight: 20,
    availability_weight: 15,
    featured_weight: 10,
    boost_featured: true,
    boost_available: true,
    hide_no_availability: true,
    hide_suspended: true,
    hide_rejected: true,
    show_country_flag: true,
  });

  const [saved, setSaved] = useState(false);

  const handleWeightChange = (key: keyof Pick<RankingRule, 'latest_weight' | 'rating_weight' | 'session_count_weight' | 'availability_weight' | 'featured_weight'>, value: number) => {
    const total = Object.values(rules).slice(0, 5).reduce((a, b) => typeof b === 'number' ? a + b : a, 0);
    const remaining = 100 - total + (rules[key] as number);

    if (value >= 0 && value <= remaining) {
      setRules({ ...rules, [key]: value });
    }
  };

  const handleToggle = (key: keyof Pick<RankingRule, 'boost_featured' | 'boost_available' | 'hide_no_availability' | 'hide_suspended' | 'hide_rejected' | 'show_country_flag'>) => {
    setRules({ ...rules, [key]: !rules[key] });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalWeight = rules.latest_weight + rules.rating_weight + rules.session_count_weight + rules.availability_weight + rules.featured_weight;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feed Ranking Rules</h1>
        <p className="text-gray-600 mt-1">Configure how packages are ranked and displayed on the public feed</p>
      </div>

      {/* Ranking Weights */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ranking Weights</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total: <span className={`font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>{totalWeight}%</span>
          </p>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          {/* Latest Published */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Latest Published Package
              </label>
              <span className="text-sm font-bold text-gray-900">{rules.latest_weight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rules.latest_weight}
              onChange={(e) => handleWeightChange('latest_weight', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-1">Newer packages appear higher</p>
          </div>

          {/* Trainer Rating */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Trainer Rating
              </label>
              <span className="text-sm font-bold text-gray-900">{rules.rating_weight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rules.rating_weight}
              onChange={(e) => handleWeightChange('rating_weight', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-1">Higher rated trainers rank higher</p>
          </div>

          {/* Session Completed Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Session Completed Count
              </label>
              <span className="text-sm font-bold text-gray-900">{rules.session_count_weight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rules.session_count_weight}
              onChange={(e) => handleWeightChange('session_count_weight', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-1">More experienced trainers rank higher</p>
          </div>

          {/* Package Availability */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Package Availability
              </label>
              <span className="text-sm font-bold text-gray-900">{rules.availability_weight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rules.availability_weight}
              onChange={(e) => handleWeightChange('availability_weight', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-1">Packages with nearby slots rank higher</p>
          </div>

          {/* Featured Boost */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Featured Boost
              </label>
              <span className="text-sm font-bold text-gray-900">{rules.featured_weight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={rules.featured_weight}
              onChange={(e) => handleWeightChange('featured_weight', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-1">Featured packages get this much boost</p>
          </div>
        </CardBody>
      </Card>

      {/* Other Rules */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Additional Rules</h2>
        </CardHeader>
        <CardBody className="p-6 space-y-3">
          {[
            {
              key: 'boost_featured' as const,
              label: 'Boost featured packages',
              description: 'Featured packages appear higher in results',
            },
            {
              key: 'boost_available' as const,
              label: 'Boost packages with available slots',
              description: 'Packages with upcoming slots rank higher',
            },
            {
              key: 'hide_no_availability' as const,
              label: 'Hide packages with no availability',
              description: 'Packages with no slots do not appear in feed',
            },
            {
              key: 'hide_suspended' as const,
              label: 'Hide packages from suspended trainers',
              description: 'Suspended trainer packages are not shown',
            },
            {
              key: 'hide_rejected' as const,
              label: 'Hide rejected packages',
              description: 'Admin-rejected packages do not appear',
            },
            {
              key: 'show_country_flag' as const,
              label: 'Show country flag on package card',
              description: 'Display trainer country flag in feed',
            },
          ].map((rule) => (
            <label
              key={rule.key}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <input
                type="checkbox"
                checked={rules[rule.key]}
                onChange={() => handleToggle(rule.key)}
                className="w-4 h-4 rounded mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{rule.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{rule.description}</p>
              </div>
            </label>
          ))}
        </CardBody>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="px-8">
          Save Ranking Rules
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">✓ Saved successfully!</span>
        )}
      </div>

      {/* Weight Info */}
      <Card className="border-0 shadow-sm bg-blue-50 border border-blue-200">
        <CardBody className="p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> The feed uses a weighted ranking algorithm. Packages are scored based on these weights, with featured packages getting an additional boost. Weights must total 100% for optimal distribution.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
