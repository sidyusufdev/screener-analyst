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

  const rankBadgeColor = isPick === 'top' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
    isPick === 'second' ? 'bg-zinc-400/15 text-zinc-300 border-zinc-400/30' :
    isPick === 'third' ? 'bg-orange-500/15 text-orange-300 border-orange-500/30' :
    isPick === 'avoid' ? 'bg-red-500/15 text-red-300 border-red-500/30' :
    'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        isPick === 'avoid'
          ? 'border-red-600/50 bg-red-900/10'
          : config
            ? `${config.border} bg-black/50`
            : 'border-zinc-700 bg-zinc-900/30'
      } hover:scale-[1.01] hover:shadow-lg`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start justify-between hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-md text-sm font-mono font-bold border ${rankBadgeColor}`}>
              #{stock.rank}
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-zinc-100 truncate">{stock.symbol}</h3>
              <p className="text-xs text-zinc-500 truncate">{stock.name}</p>
            </div>
            {config && (
              <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} whitespace-nowrap shadow-sm`}>
                {config.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-xs">Score</span>
              <span className="font-mono font-bold text-zinc-100">{stock.score.toFixed(1)}</span>
              <span className="text-zinc-600 text-xs">/10</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-xs">Prob</span>
              <span className="font-mono font-bold text-zinc-100">{stock.probability}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                stock.confidence === 'high' ? 'bg-green-400' :
                stock.confidence === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className={`font-mono font-bold text-xs ${confidenceColor}`}>
                {stock.confidence}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-xs">News</span>
              <span className={`font-mono font-bold text-xs ${newsColor}`}>
                {stock.newsRating}
              </span>
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-zinc-500 transition-all duration-300 ml-2 flex-shrink-0 ${
            isExpanded ? 'rotate-180 text-green-500' : ''
          }`}
        />
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}>
        <div className="overflow-hidden">
          <div className="border-t border-zinc-700/50 px-4 py-4 space-y-4 bg-black/20">
            {/* Price Levels */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Entry</p>
                <p className="text-sm font-mono font-bold text-green-400">{stock.entry}</p>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Stop Loss</p>
                <p className="text-sm font-mono font-bold text-red-400">{stock.stopLoss}</p>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Target 1</p>
                <p className="text-sm font-mono font-bold text-yellow-400">{stock.target1}</p>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Target 2</p>
                <p className="text-sm font-mono font-bold text-cyan-400">{stock.target2}</p>
              </div>
            </div>

            {/* Sector Tag */}
            <div className="flex gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-zinc-800/50 rounded-lg text-xs text-zinc-300 font-semibold border border-zinc-700/30">
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
              <div className="flex gap-3 p-3 bg-red-900/15 border border-red-700/40 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold text-red-300 uppercase tracking-widest mb-1">Avoid if:</p>
                  <p className="text-sm text-red-200/90 leading-relaxed">{stock.avoidIf}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
