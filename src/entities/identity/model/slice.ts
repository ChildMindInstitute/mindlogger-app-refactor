const testSingleton = { token: '' };

export const testIdentitySlice = {
  setAuth: (token: string) => {
    testSingleton.token = token;
  },
};
