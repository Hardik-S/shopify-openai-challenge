import { readSavedSearches } from './storage';

describe('readSavedSearches', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns saved response cards from localStorage', () => {
    const savedCards = [
      { id: 'cmpl-1', prompt: 'Hello', response: 'Hi there' }
    ];

    localStorage.setItem('savedSearches', JSON.stringify(savedCards));

    expect(readSavedSearches()).toEqual(savedCards);
  });

  it('discards malformed saved response data instead of throwing', () => {
    localStorage.setItem('savedSearches', '{bad json');

    expect(readSavedSearches()).toEqual([]);
    expect(localStorage.getItem('savedSearches')).toBeNull();
  });
});
