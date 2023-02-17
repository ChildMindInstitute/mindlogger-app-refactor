export function getFirstName(fullName: string): string {
  const fullNameSequence = fullName.split(' ');
  const fullNameParts = fullNameSequence.length;

  const firstName = fullNameSequence
    .slice(0, fullNameParts > 1 ? fullNameParts - 1 : undefined)
    .join(' ');

  return firstName;
}
