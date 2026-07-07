import type { Preview } from '@storybook/react';
import '@vector-os/design-system/tokens.css';
import '@vector-os/ui/styles.css';

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
