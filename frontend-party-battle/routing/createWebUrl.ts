import Constants from 'expo-constants';

export default function createWebURL(path: string) {
  const baseUrl = Constants.expoConfig?.extra?.frontendUrl;
  if (!baseUrl) return path;

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '/');

  return `${normalizedBaseUrl}${normalizedPath}`;
}
