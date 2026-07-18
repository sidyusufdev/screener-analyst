import { generateText } from 'ai';
import { SYSTEM_PROMPT } from '@/lib/constants';
import { AnalysisResponse } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { image, imageMediaType } = await request.json();

    if (!image || !imageMediaType) {
      return Response.json(
        { error: 'Missing image or imageMediaType' },
        { status: 400 }
      );
    }

    // Call Claude via Vercel AI Gateway with vision capability
    const { text } = await generateText({
      model: 'claude-sonnet-4-20250514',
      system: SYSTEM_PROMPT,
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
  }
}
