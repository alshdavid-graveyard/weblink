export const useClassName = (args: Record<string, boolean>) => {
  let output = ''
  for (const [key, value] of Object.entries(args)) {
    if (value === true) {
      output += ' '
      output += key
    }
  }
  return output
}