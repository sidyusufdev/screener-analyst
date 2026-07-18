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
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setState((prev) => ({
        ...prev,
        loadingMessage: loadingMessages[messageIndex],
      }));
    }, 5000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: state.preview.split(',')[1], // Remove data URL prefix
          imageMediaType: state.file?.type || 'image/png',
        }),
      });

      clearInterval(messageInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const results: AnalysisResponse = await response.json();

      if ('error' in results && results.error) {
        throw new Error(results.error);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto" />
          <h2 className="text-xl font-semibold text-zinc-100">Analyzing Screener</h2>
          <p className="text-sm text-zinc-400 h-6">{state.loadingMessage}</p>
          <p className="text-xs text-zinc-600 mt-4">This may take 30-90 seconds...</p>
        </div>
      </div>
    );
  }

  // Results state
  if (state.results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-100">Analysis Results</h1>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <X className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          <AnalysisResults analysis={state.results} />
        </div>
      </div>
    );
  }

  // Upload state
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">
            Screener Analyst
          </h1>
          <p className="text-zinc-400">
            Institutional-grade swing trading analysis for Indian stocks
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload or Preview */}
          {state.preview ? (
            <div className="space-y-4">
              <div className="relative border border-zinc-700 rounded-lg overflow-hidden bg-black/50">
                <img
                  src={state.preview}
                  alt="Selected screener"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={state.loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
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
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <UploadZone onFileSelect={handleFileSelect} disabled={state.loading} />
          )}

          {/* Error State */}
          {state.error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <p className="text-sm text-red-200">
                <span className="font-semibold">Error:</span> {state.error}
              </p>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="mt-3 border-red-700/50 text-red-300 hover:bg-red-900/30"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Info Card */}
          <div className="border border-zinc-700/50 bg-zinc-900/30 rounded-lg p-4">
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
