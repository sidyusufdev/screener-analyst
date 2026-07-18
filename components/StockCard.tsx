'use client';

import { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { StockAnalysis } from '@/lib/types';

interface StockCardProps {
  stock: StockAnalysis;
  isPick?: 'top' | 'second' | 'third' | 'avoid';
}

export function StockCard({ stock, isPick }: StockCardProps) {
  const [isExpanded, setIsExpanded] = useState(isPick ? true : false);

  const pickBadgeConfig = {
    top: { label: '🥇 Top Pick', bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-300' },
    second: { label: '🥈 2nd Pick', bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-300' },
    third: { label: '🥉 3rd Pick', bg: 'bg-orange-600/20', border: 'border-orange-600/50', text: 'text-orange-300' },
    avoid: { label: '⚠️ Avoid', bg: 'bg-red-900/20', border: 'border-red-600/50', text: 'text-red-300' },
  };

  const config = isPick ? pickBadgeConfig[isPick] : null;
  const confidenceColor = {
    high: 'text-green-400',
    medium: 'text-yellow-400',
    low: 'text-red-400',
  }[stock.confidence as 'high' | 'medium' | 'low'] || 'text-zinc-400';

  const newsColor = {
    positive: 'text-green-400',
    neutral: 'text-zinc-400',
    negative: 'text-red-400',
  }[stock.newsRating as 'positive' | 'neutral' | 'negative'] || 'text-zinc-400';

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        isPick === 'avoid'
          ? 'border-red-600/50 bg-red-900/10'
          : config
            ? `${config.border} bg-black/50`
            : 'border-zinc-700 bg-zinc-900/30'
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start justify-between hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-mono font-bold text-zinc-100">#{stock.rank}</span>
            <div>
              <h3 className="font-semibold text-zinc-100 truncate">{stock.symbol}</h3>
              <p className="text-xs text-zinc-500">{stock.name}</p>
            </div>
            {config && (
              <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${config.bg} ${config.text} whitespace-nowrap`}>
                {config.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <div>
              <span className="text-zinc-500">Score:</span>
              <span className="ml-2 font-mono font-bold text-zinc-100">{stock.score.toFixed(1)}/10</span>
            </div>
            <div>
              <span className="text-zinc-500">Prob:</span>
              <span className="ml-2 font-mono font-bold text-zinc-100">{stock.probability}%</span>
            </div>
            <div>
              <span className="text-zinc-500">Conf:</span>
              <span className={`ml-2 font-mono font-bold ${confidenceColor}`}>
                {stock.confidence}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">News:</span>
              <span className={`ml-2 font-mono font-bold ${newsColor}`}>
                {stock.newsRating}
              </span>
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-zinc-500 transition-transform ml-2 flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-zinc-700/50 px-4 py-4 space-y-4 bg-black/20">
          {/* Price Levels */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Entry</p>
              <p className="text-base font-mono font-bold text-green-400 mt-1">{stock.entry}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Stop Loss</p>
              <p className="text-base font-mono font-bold text-red-400 mt-1">{stock.stopLoss}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Target 1</p>
              <p className="text-base font-mono font-bold text-yellow-400 mt-1">{stock.target1}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Target 2</p>
              <p className="text-base font-mono font-bold text-cyan-400 mt-1">{stock.target2}</p>
            </div>
          </div>

          {/* Sector & Trading Tags */}
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-zinc-800/50 rounded text-xs text-zinc-300 font-semibold">
              {stock.sector}
            </span>
          </div>

          {/* Trading Thesis */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Trading Thesis</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{stock.reasoning}</p>
          </div>

          {/* Avoid Condition */}
          {stock.avoidIf && (
            <div className="flex gap-2 p-3 bg-red-900/20 border border-red-700/50 rounded">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-300 uppercase tracking-wide mb-1">Avoid if:</p>
                <p className="text-sm text-red-200">{stock.avoidIf}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
