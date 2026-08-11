/* eslint-env jest */
import { hasNonWhitespaceContent } from './has-non-whitespace-content';

describe('hasNonWhitespaceContent', () => {
  it('rejects empty and whitespace-only values', () => {
    expect(hasNonWhitespaceContent('')).toBe(false);
    expect(hasNonWhitespaceContent('  \n\t')).toBe(false);
  });

  it('accepts values containing visible content', () => {
    expect(hasNonWhitespaceContent('  explain this bug  ')).toBe(true);
  });

  it('rejects non-string values', () => {
    expect(hasNonWhitespaceContent(null)).toBe(false);
    expect(hasNonWhitespaceContent(undefined)).toBe(false);
  });
});
