import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Loading' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Full width button' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 240 }}>
      <Button iconLeft={<span>←</span>}>Back</Button>
      <Button iconRight={<span>→</span>}>Continue</Button>
      <Button iconLeft={<span>★</span>} iconRight={<span>→</span>}>
        Both icons
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
    </div>
  ),
};
