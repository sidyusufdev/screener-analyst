'use client';

import { AnalysisResponse } from '@/lib/types';
import { StockCard } from './StockCard';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: AnalysisResponse;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  if (!analysis.stocks || analysis.stocks.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-zinc-400">No stocks found in analysis.</p>
      </div>
    );
  }

  // Get top 3 picks and avoid pick
  const topPick = analysis.stocks.find(s => s.symbol === analysis.topPick);
  const secondPick = analysis.stocks.find(s => s.symbol === analysis.secondPick);
  const thirdPick = analysis.stocks.find(s => s.symbol === analysis.thirdPick);
  const avoidPick = analysis.stocks.find(s => s.symbol === analysis.avoidPick);

  const regimeColor = {
    bullish: 'text-green-400',
    neutral: 'text-yellow-400',
    bearish: 'text-red-400',
  }[analysis.marketRegime] || 'text-zinc-400';

  return (
    <div className="w-full space-y-6">
      {/* Market Summary Card */}
      <div className="border border-zinc-700 bg-zinc-900/50 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Market Regime</p>
            <p className={`text-2xl font-bold font-mono ${regimeColor}`}>
              {analysis.marketRegime.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Market Score</p>
            <p className="text-3xl font-mono font-bold text-zinc-100">
              {analysis.marketScore.toFixed(1)}/10
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed mt-3">
          {analysis.marketSummary}
        </p>
      </div>

      {/* Top Sectors */}
      {analysis.sectors && analysis.sectors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-3">Top Sectors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {analysis.sectors.slice(0, 5).map((sector) => (
              <div
                key={sector.name}
                className="border border-zinc-700 bg-zinc-900/30 rounded p-3 text-center"
              >
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">#{sector.rank}</p>
                <p className="text-sm font-semibold text-zinc-100">{sector.name}</p>
                <p className={`text-xs mt-1 font-mono font-bold ${
                  sector.strength === 'strong' ? 'text-green-400' :
                  sector.strength === 'neutral' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {sector.strength.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Picks */}
      {(topPick || secondPick || thirdPick) && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-3">Top 3 Picks</h3>
          <div className="space-y-3">
            {topPick && <StockCard stock={topPick} isPick="top" />}
            {secondPick && <StockCard stock={secondPick} isPick="second" />}
            {thirdPick && <StockCard stock={thirdPick} isPick="third" />}
          </div>
        </div>
      )}

      {/* Avoid Pick */}
      {avoidPick && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-300 uppercase tracking-wide">Avoid</h3>
          </div>
          <div className="space-y-3">
            <StockCard stock={avoidPick} isPick="avoid" />
            {analysis.avoidReason && (
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-300 uppercase tracking-wide mb-1">Reason:</p>
                <p className="text-sm text-red-200">{analysis.avoidReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Stocks Ranked */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-3">
          All Stocks ({analysis.stocks.length})
        </h3>
        <div className="space-y-2">
          {analysis.stocks.map((stock) => {
            const pickType = stock.symbol === analysis.topPick ? 'top' :
                           stock.symbol === analysis.secondPick ? 'second' :
                           stock.symbol === analysis.thirdPick ? 'third' :
                           stock.symbol === analysis.avoidPick ? 'avoid' :
                           undefined;
            
            // Skip if already shown in top picks
            if (pickType && ['top', 'second', 'third', 'avoid'].includes(pickType)) {
              return null;
            }
            
            return (
              <StockCard key={stock.symbol} stock={stock} />
            );
          })}
        </div>
      </div>

      {/* Watchlist */}
      {analysis.watchlist && analysis.watchlist.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-3">Watchlist</h3>
          <div className="border border-zinc-700 bg-zinc-900/30 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {analysis.watchlist.map((symbol) => (
                <span
                  key={symbol}
                  className="px-3 py-1 bg-blue-900/30 border border-blue-700/50 rounded text-sm font-mono text-blue-300"
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border border-yellow-700/30 bg-yellow-900/10 rounded-lg p-3">
        <p className="text-xs text-yellow-200 leading-relaxed">
          📋 {analysis.disclaimer}
        </p>
      </div>
    </div>
  );
}
