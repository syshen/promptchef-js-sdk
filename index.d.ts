declare module 'promptchef-js-sdk' {
  export enum ModelProvider {
    OPENAI = 'openai',
    CLAUDE = 'claude',
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
  export class PromptChef {
    constructor({ apiKey: string, baseUrl: string });
    testRun(params: TestRunParams): Promise<any>;
    run(params: RunParams): Promise<any>;
  }
}
