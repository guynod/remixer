// Types for API requests and responses
interface PerplexityMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PerplexityRequest {
  model: string;
  messages: PerplexityMessage[];
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// API configuration
const API_CONFIG = {
  baseUrl: 'https://api.perplexity.ai/chat/completions',
  model: 'sonar-pro',
} as const;

// Error class for API-specific errors
export class PerplexityError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'PerplexityError';
  }
}

// Validate API key
function validateApiKey(apiKey: string | undefined): string {
  if (!apiKey) {
    throw new PerplexityError(
      'API key is missing. Please add VITE_PERPLEXITY_API_KEY to your .env file.',
      401
    );
  }
  if (!apiKey.startsWith('pplx-')) {
    throw new PerplexityError(
      'Invalid API key format. Perplexity API keys should start with "pplx-"',
      401
    );
  }
  return apiKey;
}

// Main API client functions
async function makePerplexityRequest(request: PerplexityRequest): Promise<PerplexityResponse> {
  const apiKey = validateApiKey(import.meta.env.VITE_PERPLEXITY_API_KEY);
  
  const response = await fetch(API_CONFIG.baseUrl, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new PerplexityError(
        'Invalid API key. Please check your VITE_PERPLEXITY_API_KEY in the .env file.',
        response.status,
        response
      );
    }
    throw new PerplexityError(
      `API request failed: ${response.statusText}`,
      response.status,
      response
    );
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new PerplexityError('Invalid response format from API');
  }

  return data;
}

export async function remixContent(content: string): Promise<string> {
  try {
    const request: PerplexityRequest = {
      model: API_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are a creative content remixer. Be imaginative while preserving the core message.'
        },
        {
          role: 'user',
          content: content
        }
      ]
    };

    const response = await makePerplexityRequest(request);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof PerplexityError) {
      throw error;
    }
    throw new PerplexityError('Error remixing content: ' + (error as Error).message);
  }
} 