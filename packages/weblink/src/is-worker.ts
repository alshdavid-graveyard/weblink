export const targetIsWorker = (target: any): boolean => {
  try {
    if (target.terminate) {
      return true
    }
  } catch (error) {}
  return false
}