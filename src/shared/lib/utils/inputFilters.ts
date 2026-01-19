// Filters input to only allow digits (0-9)
// Used for verification code input to prevent letters, symbols, and spaces
export const filterDigitsOnly = (text: string): string => {
  return text.replace(/[^0-9]/g, '');
};

// Filters and formats recovery code input
// Removes symbols/spaces, converts to uppercase, adds hyphen after 5 chars (XXXXX-XXXXX)
export const formatRecoveryCode = (text: string): string => {
  // Only allow alphanumeric characters, remove symbols and spaces
  const alphanumericOnly = text.replace(/[^A-Za-z0-9-]/g, '');

  // Auto-format: add hyphen after 5 characters
  const cleaned = alphanumericOnly.replace(/-/g, '').toUpperCase();

  if (cleaned.length > 5) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 10)}`;
  }

  return cleaned;
};
