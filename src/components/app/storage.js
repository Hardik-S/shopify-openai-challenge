const SAVED_SEARCHES_KEY = 'savedSearches';

export const readSavedSearches = () => {
  const savedSearches = localStorage.getItem(SAVED_SEARCHES_KEY);

  if (!savedSearches) {
    return [];
  }

  try {
    const parsedSearches = JSON.parse(savedSearches);

    if (Array.isArray(parsedSearches)) {
      return parsedSearches;
    }
  } catch (err) {
    // Invalid persisted data should not prevent the app from rendering.
  }

  localStorage.removeItem(SAVED_SEARCHES_KEY);
  return [];
};

export const writeSavedSearches = (savedSearches) => {
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(savedSearches));
};

export const clearSavedSearches = () => {
  localStorage.removeItem(SAVED_SEARCHES_KEY);
};
