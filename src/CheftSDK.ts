import axios, { AxiosInstance } from 'axios';

export enum ModelProvider {
  OPENAI = "openai",
  CLAUDE = "claude",
  GEMINI = "gemini",
}

export interface ModelSettings {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface Variable {
  name: string;
  value: string;
}

export interface RunParams {
  projectId: number;
  promptId: number;
  user_message: string;
  variables?: Variable[];
}

export interface TestRunParams extends RunParams {
  model_provider: ModelProvider;
  model_name: string;
  model_settings: ModelSettings;
  system_prompt: string;
  variables?: Variable[];
}

export class PromptCheft {
  private apiKey: string;
  private client: AxiosInstance;

  constructor({apiKey = process.env.CHEFT_API_KEY, baseUrl = 'https://api.promptcheft.com'}: {apiKey?: string, baseUrl?: string} = {}) {
    if (!apiKey) {
      throw new Error('API Key is required');
    }
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'CHEFT_API_KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async providers(): Promise<any> {
    const response = await this.client.get('/v1/providers');
    return response.data;
  }

  async models(provider: string): Promise<any> {
    const response = await this.client.get(`/v1/models/${provider}`);
    return response.data;
  }

  async run(params: RunParams): Promise<any> {
    const { projectId, promptId, user_message, variables } = params;
    try {
      const response = await this.client.post(`/v1/prompt/${projectId}/${promptId}/`, {
        user_message,
        variables,
      });
      return response.data
    } catch (error: any) {
      throw new Error(`Error in run: ${error.message}\n${error.response.data}`);
    }
  }

  async testRun(params: TestRunParams): Promise<any> {
    const { projectId, promptId, user_message, variables, model_provider, model_name, model_settings, system_prompt } = params;
    try {
      const response = await this.client.post(`/v1/test-run/${projectId}/${promptId}/`, {
        user_message,
        variables,
        model_provider,
        model_name,
        model_settings,
        system_prompt,
      });
      return response.data
    } catch (error: any) {
      throw new Error(`Error in testRun: ${error.message}\n${error.response.data}`);
    }
  }
}
