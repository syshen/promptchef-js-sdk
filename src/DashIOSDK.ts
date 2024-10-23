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
  outputFormat?: string;
}

export class PromptDashIO {
  private apiKey: string;
  private client: AxiosInstance;

  constructor(
    {
      apiKey = process.env.DASH_API_KEY,
      baseUrl = process.env.DASH_BASE_URL || 'https://api.promptdash.io',
    }: {apiKey?: string, baseUrl?: string},
  ) {
    if (!apiKey) {
      throw new Error('API Key is required');
    }
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'DASH_API_KEY': this.apiKey,
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
    const {
      projectId,
      promptId,
      userMessage,
      modelProvider,
      modelName,
      modelSettings,
      systemPrompt,
      outputFormat,
    } = params;
    try {
      const response = await this.client.post(`/v1/test-run/${projectId}/${promptId}/`, {
        userMessage,
        modelProvider,
        modelName,
        modelSettings,
        systemPrompt,
        outputFormat,
      });
      return response.data
    } catch (error: any) {
      throw new Error(`Error in testRun: ${error.message}\n${error.response.data}`);
    }
  }
}
