declare module 'promptchef-js-sdk' {
  export enum ModelProvider {
    OPENAI = 'openai',
    CLAUDE = 'claude',
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
    constructor({ apiKey, baseUrl }: { apiKey?: string, baseUrl?: string });
    testRun(params: TestRunParams): Promise<any>;
    run(params: RunParams): Promise<any>;
  }
}
