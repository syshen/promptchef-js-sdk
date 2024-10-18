import axios, { AxiosInstance } from 'axios';

export enum ModelProvider {
  OPENAI = "openai",
  CLAUDE = "claude",
  GEMINI = "gemini",
}

export interface ModelSettings {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface Variable {
  name: string;
  value: string;
}

export interface RunParams {
  projectId: number;
  promptId: number;
  userMessage: string;
  variables?: Variable[];
}

export interface TestRunParams extends RunParams {
  modelProvider: ModelProvider;
  modelName: string;
  modelSettings: ModelSettings;
  systemPrompt: string;
  variables?: Variable[];
}

export class PromptChef {
  private apiKey: string;
  private client: AxiosInstance;

  constructor({apiKey = process.env.CHEF_API_KEY, baseUrl = 'https://api.promptchef.com'}: {apiKey?: string, baseUrl?: string} = {}) {
    if (!apiKey) {
      throw new Error('API Key is required');
    }
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'CHEF_API_KEY': this.apiKey,
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
    const { projectId, promptId, userMessage, variables } = params;
    try {
      const response = await this.client.post(`/v1/prompt/${projectId}/${promptId}/`, {
        userMessage,
        variables,
      });
      return response.data
    } catch (error: any) {
      throw new Error(`Error in run: ${error.message}\n${error.response.data}`);
    }
  }

  async testRun(params: TestRunParams): Promise<any> {
    const { projectId, promptId, userMessage, variables, modelProvider, modelName, modelSettings, systemPrompt } = params;
    try { 
      const response = await this.client.post(`/v1/test-run/${projectId}/${promptId}/`, {
        userMessage,
        variables,
        modelProvider,
        modelName,
        modelSettings,
        systemPrompt,
      });
      return response.data
    } catch (error: any) {
      throw new Error(`Error in testRun: ${error.message}\n${error.response.data}`);
    }
  }
}
