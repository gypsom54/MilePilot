import type { Preview } from '@storybook/react';
import '@vector-platform/tokens/tokens.css';
import '@vector-platform/ui/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
