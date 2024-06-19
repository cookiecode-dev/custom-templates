export const buildNumber = new Date()
  .toISOString()
  .replace(/\..+/, '')
  .replace(/T/, '.')
  .replace(/[-:]/g, '')
  .substring(2);
