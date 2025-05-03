
import { toast } from "sonner";

export type LLMProvider = 'openai' | 'local';

export interface LLMResponse {
  text: string;
  source: 'faq' | 'llm';
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  localEndpoint?: string;
}

export const defaultLLMConfig: LLMConfig = {
  provider: 'local',
  localEndpoint: 'http://localhost:1234/v1/chat/completions'
};

export async function generateResponse(
  message: string,
  context: string[] = [],
  config: LLMConfig = defaultLLMConfig
): Promise<LLMResponse | null> {
  try {
    if (config.provider === 'openai') {
      return await callOpenAI(message, context, config.apiKey || '');
    } else {
      return await callLocalLLM(message, context, config.localEndpoint || 'http://localhost:1234/v1/chat/completions');
    }
  } catch (error: any) {
    console.error('Error generating LLM response:', error);
    const errorMessage = error?.message || 'Failed to get a response from the AI';
    toast.error(errorMessage);
    return {
      text: `Error: ${errorMessage}. Please check your connection and settings.`,
      source: 'llm'
    };
  }
}

async function callOpenAI(message: string, context: string[], apiKey: string): Promise<LLMResponse> {
  if (!apiKey) {
    const error = 'OpenAI API key is not configured';
    toast.error(error);
    return {
      text: `Error: ${error}. Please configure your API key in settings.`,
      source: 'llm'
    };
  }

  const contextString = context.join('\n');
  const fullPrompt = contextString ? `${contextString}\n\nUser: ${message}` : message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity assistant analyzing network traffic and alerts. Only state facts that can be directly inferred from the data provided. Do not speculate. Be concise, objective, and helpful in your summaries. Focus on identifying protocols, IP addresses, suspicious behavior, or rule triggers. If no meaningful information is found, respond with "No notable activity detected."'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText || 'Unknown error';
      throw new Error(`OpenAI API error: ${errorMessage}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      source: 'llm'
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

async function callLocalLLM(message: string, context: string[], endpoint: string): Promise<LLMResponse> {
  if (!endpoint) {
    const error = 'Local LLM endpoint is not configured';
    toast.error(error);
    return {
      text: `Error: ${error}. Please configure your local endpoint in settings.`,
      source: 'llm'
    };
  }

  const contextString = context.join('\n');
  const fullPrompt = contextString ? `${contextString}\n\nUser: ${message}` : message;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity assistant analyzing network traffic and alerts. Only state facts that can be directly inferred from the data provided. Do not speculate. Be concise, objective, and helpful in your summaries. Focus on identifying protocols, IP addresses, suspicious behavior, or rule triggers. If no meaningful information is found, respond with "No notable activity detected."'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      // Try alternative format for some local LLMs that expect a different payload
      return await tryAlternativeLocalLLM(fullPrompt, endpoint);
    }

    const data = await response.json();
    
    // Handle different response formats
    let content;
    if (data.choices && data.choices[0] && data.choices[0].message) {
      content = data.choices[0].message.content; // Standard OpenAI format
    } else if (data.message && data.message.content) {
      content = data.message.content; // Format used by some local models
    } else if (data.response) {
      content = data.response; // Simple response format
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from local LLM');
    }
    
    if (!content) {
      throw new Error('Failed to extract content from response');
    }
    
    return {
      text: content,
      source: 'llm'
    };
  } catch (error: any) {
    console.error('Error calling local LLM:', error);
    throw new Error(`Local LLM error: ${error.message}`);
  }
}

// Try alternative format for llama.cpp and other local LLMs
async function tryAlternativeLocalLLM(message: string, endpoint: string): Promise<LLMResponse> {
  try {
    // For llama.cpp API format
    const llamaEndpoint = endpoint.endsWith('/api/generate') ? endpoint : `${endpoint.replace(/\/+$/, '')}/api/generate`;
    
    const response = await fetch(llamaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: message
      })
    });

    if (!response.ok) {
      throw new Error(`Alternative local LLM API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract content from llama.cpp response
    const content = data.response || data.output || data.generated_text;
    
    if (!content) {
      throw new Error('Failed to extract content from alternative LLM response');
    }
    
    return {
      text: content,
      source: 'llm'
    };
  } catch (error: any) {
    console.error('Error with alternative local LLM format:', error);
    throw new Error(`Alternative local LLM error: ${error.message}`);
  }
}
