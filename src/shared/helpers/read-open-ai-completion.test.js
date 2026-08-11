/* eslint-env jest */
import { readOpenAiCompletion } from './read-open-ai-completion';

describe('readOpenAiCompletion', () => {
  it('returns the id and first completion text', () => {
    expect(readOpenAiCompletion({
      id: 'cmpl-1',
      choices: [{ text: 'Hi there' }]
    })).toEqual({ id: 'cmpl-1', text: 'Hi there' });
  });

  it('rejects a response without a completion choice', () => {
    expect(() => readOpenAiCompletion({ id: 'cmpl-1', choices: [] }))
      .toThrow('usable completion');
  });

  it('rejects a response with malformed completion data', () => {
    expect(() => readOpenAiCompletion({
      id: 'cmpl-1',
      choices: [{ text: null }]
    })).toThrow('usable completion');
  });
});
