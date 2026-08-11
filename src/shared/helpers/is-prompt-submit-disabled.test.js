/* eslint-env jest */
import { isPromptSubmitDisabled } from './is-prompt-submit-disabled';

describe('isPromptSubmitDisabled', () => {
  it('disables invalid forms', () => {
    expect(isPromptSubmitDisabled({
      isValid: false,
      submitButtonText: 'Submit'
    })).toBe(true);
  });

  it('disables the button while a request is in flight', () => {
    expect(isPromptSubmitDisabled({
      isValid: true,
      submitButtonText: 'Thinking...'
    })).toBe(true);
  });

  it('enables a valid form when no request is active', () => {
    expect(isPromptSubmitDisabled({
      isValid: true,
      submitButtonText: 'Submit'
    })).toBe(false);
  });
});
