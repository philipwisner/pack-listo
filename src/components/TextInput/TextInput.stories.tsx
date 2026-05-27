import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./TextInput";

const meta = {
  title: "Components/TextInput",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Enter text...",
    type: "text",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hovered: Story = {
  args: {
    placeholder: "Enter your e-mail",
  },
  parameters: {
    pseudo: {
      hover: "input",
    },
  },
};

export const Focused: Story = {
  args: {
    placeholder: "Enter your e-mail",
  },
  parameters: {
    pseudo: {
      focus: "input",
    },
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: "Enter your e-mail",
    hasError: true,
  },
};

export const Success: Story = {
  args: {
    placeholder: "Looks good!",
    hasSuccess: true,
  },
};
