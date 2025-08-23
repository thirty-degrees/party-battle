export const script = (mode: string) => {
  const documentElement = document.documentElement;
  const body = document.body;

  function getSystemColorMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  try {
    const isSystem = mode === 'system';
    const theme = isSystem ? getSystemColorMode() : mode;
    const backgroundMap: Record<string, string> = {
      light: '255 255 255',
      dark: '18 18 18',
    };
    documentElement.classList.remove(theme === 'light' ? 'dark' : 'light');
    documentElement.classList.add(theme);
    documentElement.style.colorScheme = theme;
    const background = backgroundMap[theme];
    documentElement.style.backgroundColor = `rgb(${background})`;
    if (body) {
      body.style.backgroundColor = `rgb(${background})`;
    }
  } catch (e) {
    console.error(e);
  }
};
