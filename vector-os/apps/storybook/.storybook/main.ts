import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
  ],
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
      '@vector-platform/ui': new URL('../../../packages/ui/src', import.meta.url).pathname,
      '@vector-platform/icons': new URL('../../../packages/icons/src', import.meta.url).pathname,
      '@vector-platform/utils': new URL('../../../packages/utils/src', import.meta.url).pathname,
      '@vector-platform/types': new URL('../../../packages/types/src', import.meta.url).pathname,
      '@vector-platform/tokens': new URL('../../../packages/tokens/src', import.meta.url).pathname,
    };

    return config;
  },
};

export default config;
