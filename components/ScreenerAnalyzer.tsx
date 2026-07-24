'use client';

import { useState } from 'react';
import { UploadZone } from './UploadZone';
import { AnalysisResults } from './AnalysisResults';
import { AnalysisResponse, AnalyzerState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

export function ScreenerAnalyzer() {
  const [state, setState] = useState<AnalyzerState>({
    file: null,
    preview: null,
    loading: false,
    results: null,
    error: null,
    loadingMessage: '',
  });

  const loadingMessages = [
    'Reading screener...',
    'Analyzing stocks...',
    'Checking market conditions...',
    'Researching sector trends...',
    'Running web search...',
    'Evaluating probabilities...',
    'Ranking positions...',
  ];

  const handleFileSelect = (file: File, preview: string) => {
    setState((prev) => ({
      ...prev,
      file,
      preview,
      error: null,
      results: null,
    }));
  };

  const handleAnalyze = async () => {
    if (!state.preview) return;

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      loadingMessage: loadingMessages[0],
    }));

    // Rotate loading messages
    let messageIndex = 0;
    const messageInterval = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setState((prev) => ({
        ...prev,
        loadingMessage: loadingMessages[messageIndex],
      }));
    }, 5000);

    const analysisAbortController = new AbortController();

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: state.preview.split(',')[1], // Remove data URL prefix
          imageMediaType: state.file?.type || 'image/png',
        }),
        signal: analysisAbortController.signal,
      });

      clearInterval(messageInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as { error?: string }).error || `API error: ${response.status}`);
      }

      const results: AnalysisResponse = await response.json();

      if ('error' in results && typeof (results as { error?: unknown }).error === 'string') {
        throw new Error((results as { error?: string }).error ?? 'Analysis failed');
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        results,
        error: null,
        loadingMessage: '',
      }));
    } catch (error) {
      clearInterval(messageInterval);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      if (error instanceof Error && error.name === 'AbortError') {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Analysis took too long. Please try again.',
          loadingMessage: '',
        }));
        return;
      }
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        loadingMessage: '',
      }));
    }
  };

  const handleReset = () => {
    setState({
      file: null,
      preview: null,
      loading: false,
      results: null,
      error: null,
      loadingMessage: '',
    });
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-black p-4">
        {/* Animated background dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-500/20 rounded-full animate-float" style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-500/15 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-green-400/10 rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-emerald-500/20 rounded-full animate-float" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-teal-400/15 rounded-full animate-float" style={{ animationDelay: '1.5s', animationDuration: '5.5s' }} />
        </div>

        <div className="text-center space-y-5 relative z-10">
          <div className="relative">
            <Loader2 className="w-14 h-14 animate-spin text-green-500 mx-auto" />
            <div className="absolute inset-0 w-14 h-14 mx-auto rounded-full bg-green-500/10 blur-xl animate-glow-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gradient">Analyzing Screener</h2>
            <p className="text-sm text-zinc-400 mt-1">AI is researching market data for you</p>
          </div>
          <div className="h-8 flex items-center justify-center">
            <span className="text-sm text-zinc-500 font-mono">{state.loadingMessage}</span>
            <span className="ml-1 inline-flex">
              <span className="w-1 h-1 bg-zinc-500 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-zinc-500 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-zinc-500 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
          <div className="w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full animate-shimmer" style={{ width: '60%' }} />
          </div>
          <p className="text-xs text-zinc-600 mt-2">This may take 30-90 seconds...</p>
        </div>
      </div>
    );
  }

  // Results state
  if (state.results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black p-4 sm:p-6 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between animate-fade-in-up-delay-1">
            <h1 className="text-2xl font-bold text-gradient">Analysis Results</h1>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          <div className="animate-fade-in-up-delay-2">
            <AnalysisResults analysis={state.results} />
          </div>
        </div>
      </div>
    );
  }

  // Upload state
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-cyan-500 mb-4 shadow-lg animate-float">
            <span className="text-2xl font-bold text-black">SA</span>
          </div>
          <h1 className="text-5xl font-bold text-gradient mb-2">
            Screener Analyst
          </h1>
          <p className="text-zinc-400 text-lg">
            Institutional-grade swing trading analysis for Indian stocks
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload or Preview */}
          {state.preview ? (
            <div className="space-y-4 animate-fade-in-up">
              <div className="relative border border-zinc-700 rounded-lg overflow-hidden bg-black/50 group">
                <img
                  src={state.preview}
                  alt="Selected screener"
                  className="w-full h-auto max-h-96 object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={state.loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-2.5 shadow-lg shadow-green-900/30 transition-all duration-300 hover:shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Analyze Screenshot
                </Button>
                <Button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      file: null,
                      preview: null,
                      error: null,
                    }))
                  }
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-up-delay-1">
              <UploadZone onFileSelect={handleFileSelect} disabled={state.loading} />
            </div>
          )}

          {/* Error State */}
          {state.error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 animate-fade-in-up">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-300 mb-1">Analysis Failed</p>
                  <p className="text-sm text-red-200/80">{state.error}</p>
                </div>
              </div>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="mt-3 border-red-700/50 text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all duration-200"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Info Card */}
          <div className="glass rounded-lg p-4 animate-fade-in-up-delay-2">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="font-semibold text-zinc-300">💡 Tip:</span> Upload a clear
              Chartink screener screenshot. The analysis uses AI to evaluate market conditions,
              research real-time data, and rank trading opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
