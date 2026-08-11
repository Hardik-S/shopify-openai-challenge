export const readOpenAiCompletion = (data) => {
  const firstChoice = data && Array.isArray(data.choices)
    ? data.choices[0]
    : null;

  if (
    !data
    || typeof data.id !== 'string'
    || !firstChoice
    || typeof firstChoice.text !== 'string'
  ) {
    throw new Error('OpenAI response did not contain a usable completion.');
  }

  return {
    id: data.id,
    text: firstChoice.text
  };
};
