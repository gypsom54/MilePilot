import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    config.css = {
      ...config.css,
      modules: {
        localsConvention: 'camelCase',
      },
    };

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@vector-os/ui': new URL('../../../packages/ui/src', import.meta.url).pathname,
      '@vector-os/icons': new URL('../../../packages/icons/src', import.meta.url).pathname,
      '@vector-os/utils': new URL('../../../packages/utils/src', import.meta.url).pathname,
      '@vector-os/types': new URL('../../../packages/types/src', import.meta.url).pathname,
      '@vector-os/design-system': new URL('../../../packages/design-system/src', import.meta.url).pathname,
    };

    return config;
  },
};

export default config;
