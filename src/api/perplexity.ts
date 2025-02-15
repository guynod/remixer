// Types for API requests and responses
interface PerplexityMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PerplexityRequest {
  model: string;
  messages: PerplexityMessage[];
  temperature?: number;
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
  baseUrl: 'https://api.perplexity.ai/v1',
  model: 'mixtral-8x7b-instruct',
  defaultTemperature: 0.7,
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

// Main API client functions
async function makePerplexityRequest(request: PerplexityRequest): Promise<PerplexityResponse> {
  const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`
    },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new PerplexityError(
      `API request failed: ${response.statusText}`,
      response.status,
      response
    );
  }

  return response.json();
}

export async function remixContent(content: string): Promise<string> {
  try {
    const request: PerplexityRequest = {
      model: API_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: `Please remix and reimagine this text in an interesting way while keeping the main message: ${content}`
        }
      ],
      temperature: API_CONFIG.defaultTemperature
    };

    const response = await makePerplexityRequest(request);
    return response.choices[0].message.content;
  } catch (error) {
    if (error instanceof PerplexityError) {
      throw error;
    }
    throw new PerplexityError('Error remixing content: ' + (error as Error).message);
  }
} 