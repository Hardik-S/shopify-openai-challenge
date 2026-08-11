export const isCurrentPromptRequest = (requestGeneration, currentClearGeneration) => (
  requestGeneration === currentClearGeneration
);
