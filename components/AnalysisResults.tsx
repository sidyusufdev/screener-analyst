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
      <div className="glass rounded-lg p-5 transition-all duration-300 hover:border-zinc-600">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Market Regime</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full animate-glow-pulse ${
                analysis.marketRegime === 'bullish' ? 'bg-green-400' :
                analysis.marketRegime === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
              }`} />
              <p className={`text-2xl font-bold font-mono ${regimeColor}`}>
                {analysis.marketRegime.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Market Score</p>
            <p className="text-3xl font-mono font-bold text-zinc-100">
              {analysis.marketScore.toFixed(1)}/10
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed mt-3 border-t border-zinc-700/50 pt-3">
          {analysis.marketSummary}
        </p>
      </div>

      {/* Top Sectors */}
      {analysis.sectors && analysis.sectors.length > 0 && (
        <div className="animate-fade-in-up-delay-1">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-3">Top Sectors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {analysis.sectors.slice(0, 5).map((sector, i) => (
              <div
                key={sector.name}
                className="glass rounded-lg p-3 text-center transition-all duration-300 hover:scale-[1.03] hover:border-zinc-600"
                style={{ animationDelay: `${i * 80}ms` }}
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
        <div className="animate-fade-in-up-delay-2">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">Top Picks</h3>
          </div>
          <div className="space-y-3">
            {topPick && <div className="glow-green rounded-lg"><StockCard stock={topPick} isPick="top" /></div>}
            {secondPick && <div className="glow-amber rounded-lg"><StockCard stock={secondPick} isPick="second" /></div>}
            {thirdPick && <div className="glow-cyan rounded-lg"><StockCard stock={thirdPick} isPick="third" /></div>}
          </div>
        </div>
      )}

      {/* Avoid Pick */}
      {avoidPick && (
        <div className="animate-fade-in-up-delay-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-300 uppercase tracking-wide">Avoid</h3>
          </div>
          <div className="space-y-3">
            <div className="glow-red rounded-lg">
              <StockCard stock={avoidPick} isPick="avoid" />
            </div>
            {analysis.avoidReason && (
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                <p className="text-xs font-semibold text-red-300 uppercase tracking-wide mb-1.5">Reason:</p>
                <p className="text-sm text-red-200/90 leading-relaxed">{analysis.avoidReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Stocks Ranked */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-3">
          All Stocks <span className="text-zinc-500">({analysis.stocks.length})</span>
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
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wide mb-3">Watchlist</h3>
          <div className="glass rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {analysis.watchlist.map((symbol) => (
                <span
                  key={symbol}
                  className="px-3 py-1.5 bg-blue-900/20 border border-blue-700/40 rounded-lg text-sm font-mono text-blue-300 transition-all duration-200 hover:bg-blue-900/40 hover:border-blue-600/60 hover:scale-105 cursor-default"
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border border-yellow-700/30 bg-yellow-900/10 rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <p className="text-xs text-yellow-200/80 leading-relaxed">
          📋 {analysis.disclaimer}
        </p>
      </div>
    </div>
  );
}
