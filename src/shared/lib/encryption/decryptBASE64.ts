export const decryptBASE64 = (value = "") => {
  return window.atob(value)
}
