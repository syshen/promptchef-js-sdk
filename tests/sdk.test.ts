import dotenv from 'dotenv';
dotenv.config();

import {PromptChef, ModelProvider} from '../src/ChefSDK';

describe('PromptChef tests', () => {
  const baseUrl = process.env.CHEF_BASE_URL;
  const apiKey = process.env.CHEF_API_KEY;

  it('should be able to create a new instance', () => {
    const chef = new PromptChef({baseUrl, apiKey});
    expect(chef).toBeDefined();
  });

  it('should be able to get providers', async () => {
    const chef = new PromptChef({baseUrl, apiKey});
    const providers = await chef.providers();
    expect(providers).toBeDefined();
    expect(providers.providers.length).toBeGreaterThan(0);
    expect(providers.providers[0]).toBe('openai');
  });

  it('should be able to get models', async () => {
    const chef = new PromptChef({baseUrl, apiKey});
    const models = await chef.models('openai');
    expect(models).toBeDefined();
    expect(models.models.length).toBeGreaterThan(0);
  });

  it('should be able to run a prompt', async () => {
    const chef = new PromptChef({baseUrl, apiKey});
    const run = await chef.run({
      projectId: 1,
      promptId: 1,
      user_message: '1 + 1 = ?',
    });
    expect(run).toBeDefined();
    expect(run.result).toBeDefined();
    expect(run.result.response).toBeDefined();
  });

  it('should be able to test a prompt', async () => {
    const chef = new PromptChef({baseUrl, apiKey});
    const testRun = await chef.testRun({
      projectId: 1,
      promptId: 1,
      user_message: '1 + 1 = ?',
      system_prompt: 'You are a math teacher',
      model_provider: ModelProvider.OPENAI,
      model_name: 'gpt-3.5-turbo',
      model_settings: {
        temperature: 0.5,
        max_tokens: 1000,
        top_p: 0.5,
        top_k: 0.5,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      },
    });
    expect(testRun).toBeDefined();
    expect(testRun.result).toBeDefined();
    expect(testRun.result.response).toBeDefined();
  });
});
