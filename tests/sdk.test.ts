import dotenv from 'dotenv';
dotenv.config();

import {PromptDashIO, ModelProvider} from '../src/DashIOSDK';

describe('PromptDash tests', () => {
  it('should be able to create a new instance', () => {
    const dash = new PromptDashIO({});
    expect(dash).toBeDefined();
  });

  it('should be able to get providers', async () => {
    const dash = new PromptDashIO({});
    const providers = await dash.providers();
    expect(providers).toBeDefined();
    expect(providers.providers.length).toBeGreaterThan(0);
    expect(providers.providers[0]).toBe('openai');
  });

  it('should be able to get models', async () => {
    const dash = new PromptDashIO({});
    const models = await dash.models('openai');
    expect(models).toBeDefined();
    expect(models.models.length).toBeGreaterThan(0);
  });

  it('should be able to run a prompt', async () => {
    const dash = new PromptDashIO({});
    const run = await dash.run({
      projectId: 1,
      promptId: 1,
      userMessage: '1 + 1 = ?',
    });
    expect(run).toBeDefined();
    console.log(run);
    expect(run.response).toBeDefined();
  });

  it('should be able to test a prompt', async () => {
    const dash = new PromptDashIO({});
    const testRun = await dash.testRun({
      projectId: 1,
      promptId: 1,
      userMessage: '1 + 1 = ?',
      systemPrompt: 'You are a math teacher',
      modelProvider: ModelProvider.OPENAI,
      modelName: 'gpt-3.5-turbo',
      modelSettings: {
        temperature: 0.5,
        maxTokens: 1000,
        topP: 0.5,
        topK: 0.5,
        frequencyPenalty: 0.5,
        presencePenalty: 0.5,
      },
    });
    expect(testRun).toBeDefined();
    expect(testRun.response).toBeDefined();
  });
});
