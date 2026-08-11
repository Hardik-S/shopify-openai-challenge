export const hasNonWhitespaceContent = (value) =>
  typeof value === 'string' && value.trim().length > 0;
