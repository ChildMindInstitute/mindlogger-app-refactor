export const invertColor = (hex: string) => {
  const hexColor = hex.replace('#', '');
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#333333' : 'white';
};

export const handleReplaceBehaviourResponse = (string: string) => string; // @todo complete this function
