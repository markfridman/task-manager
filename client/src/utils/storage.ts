export const storage = {
  getToken: (): string | null => localStorage.getItem('token'),
  setToken: (token: string): void => localStorage.setItem('token', token),
  removeToken: (): void => localStorage.removeItem('token'),
  clear: (): void => localStorage.clear(),
};
