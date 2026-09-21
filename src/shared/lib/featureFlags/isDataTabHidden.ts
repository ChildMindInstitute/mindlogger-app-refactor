// Deny-list: the flag holds applet ids whose Data tab should be hidden.
export const isDataTabHidden = (flag: string[], appletId: string): boolean =>
  flag.includes('*') || flag.includes(appletId);
