export const insertAfterMedia = (markdown: string, inserted: string) => {
  const lines = markdown.split('\n');
  // Stop at first line containing content that is not:
  // - solely a media element (<img>/<video>/<audio>/![...](...))
  // - a media element wrapped in an alignment block (::: hljs-* ... :::)
  let i: number;
  for (i = 0; i < lines.length; i++) {
    const lineWithoutMedia = lines[i]
      .replaceAll(
        /^:::\s+hljs-\S+|:::$|<img[^>]+>|<video[^>]+>.*<\/video>|<audio[^>]+>.*<\/audio>|!\[[^\]]*\]\([^)]*\)/gi,
        '',
      )
      .trim();
    if (lineWithoutMedia) break;
  }

  if (i === lines.length) {
    // Append string to bottom if no lines containing non-media content were found
    lines.push(`\n${inserted}`);
  } else {
    // Else insert string before line containing non-media content
    lines.splice(i, 0, `\n${inserted}\n`);
  }

  return lines.join('\n');
};
