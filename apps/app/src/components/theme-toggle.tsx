'use client';

import Button from './button';
import { setGlobalTheme, useThemeObserver } from '@atlaskit/tokens';

export default function ThemeToggle() {
  const theme = useThemeObserver();

  const switchColorMode = () => {
    setGlobalTheme((themeState) => {
      return {
        ...themeState,
        shape: 'shape',
        colorMode: themeState.colorMode === 'light' ? 'dark' : 'light',
      }
    });
  };

  return (
    <Button appearance="primary" onClick={switchColorMode}>
      {theme.colorMode === 'light' ? 'Change Dark Mode' : 'Change Light Mode'}
    </Button>
  );
}
