/* eslint-env jest */
import { isCurrentPromptRequest } from './response-state';

describe('prompt response lifecycle', () => {
  it('accepts a response from the current clear generation', () => {
    expect(isCurrentPromptRequest(2, 2)).toBe(true);
  });

  it('rejects a response that started before the saved list was cleared', () => {
    expect(isCurrentPromptRequest(1, 2)).toBe(false);
  });
});
