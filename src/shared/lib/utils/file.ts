export const isLocalFileUrl = (value: string) => {
  const localFileRegex =
    /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV|svg|mpeg)$/;

  return localFileRegex.test(value);
};
