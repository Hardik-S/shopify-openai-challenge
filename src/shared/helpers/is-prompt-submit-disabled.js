export const isPromptSubmitDisabled = ({ isValid, submitButtonText }) => (
  !isValid || submitButtonText !== 'Submit'
);
