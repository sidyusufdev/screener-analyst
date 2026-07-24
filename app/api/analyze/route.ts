import { generateText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/constants';
import { AnalysisResponse } from '@/lib/types';

const MAX_ANALYSIS_TIME_MS = 45_000;

export async function POST(request: Request) {
  try {
    const { image, imageMediaType } = await request.json();

    if (!image || !imageMediaType) {
      return Response.json(
        { error: 'Missing image or imageMediaType' },
        { status: 400 }
      );
    }

    if (!process.env.AI_GATEWAY_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'AI service is not configured. Add AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY to continue.' },
        { status: 503 }
      );
    }

    const base64Size = Math.round((image.length * 3) / 4);
    if (base64Size > 8 * 1024 * 1024) {
      return Response.json(
        { error: 'Image is too large. Please use a smaller screenshot.' },
        { status: 413 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MAX_ANALYSIS_TIME_MS);

    try {
      // Call Claude via Vercel AI Gateway with vision capability
      const { text } = await generateText({
        model: 'claude-sonnet-4-20250514',
        system: SYSTEM_PROMPT,
        abortSignal: controller.signal,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                image: image, // base64 string
                mimeType: imageMediaType as 'image/png' | 'image/jpeg' | 'image/webp',
              },
              {
                type: 'text',
                text: 'Analyze this Chartink screener screenshot comprehensively and provide trading recommendations. Return ONLY valid JSON with no markdown formatting or extra text.',
              },
            ],
          },
        ],
      });

      // Parse the JSON response from Claude
      let result: Partial<AnalysisResponse>;
      try {
        // Extract JSON from the response (handle cases where Claude wraps it in markdown)
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
        const jsonString = jsonMatch[1] || text;
        result = JSON.parse(jsonString.trim());
      } catch (parseError) {
        console.error('[v0] JSON parse error:', parseError);
        return Response.json(
          { error: 'Failed to parse analysis response. Please try again.' },
          { status: 500 }
        );
      }

      // Check for error in response
      if ('error' in result && result.error) {
        return Response.json({ error: result.error }, { status: 400 });
      }

      return Response.json(result);
    } catch (error) {
      console.error('[v0] Analysis API error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      if (error instanceof Error && error.name === 'AbortError') {
        return Response.json(
          { error: 'Analysis timed out. Please try again with a smaller or clearer screenshot.' },
          { status: 504 }
        );
      }

      if (errorMessage.includes('timeout') || errorMessage.includes('deadline')) {
        return Response.json(
          { error: 'Analysis took too long. Please try again with a clearer screenshot.' },
          { status: 408 }
        );
      }

      if (errorMessage.includes('invalid') || errorMessage.includes('format')) {
        return Response.json(
          { error: 'Invalid image format. Please use PNG, JPEG, or WebP.' },
          { status: 400 }
        );
      }

      if (errorMessage.includes('auth') || errorMessage.includes('unauthorized') || errorMessage.includes('credit card') || errorMessage.includes('customer_verification')) {
        return Response.json(
          { error: 'AI Gateway billing required. Please add a valid credit card to your Vercel account to use this feature. Visit https://vercel.com/account/billing to set up billing.' },
          { status: 403 }
        );
      }

      return Response.json(
        { error: 'Failed to analyze screenshot. Please try again or check your API configuration.' },
        { status: 500 }
      );
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('[v0] Request parsing error:', error);
    return Response.json(
      { error: 'Invalid request payload.' },
      { status: 400 }
    );
  }
}
