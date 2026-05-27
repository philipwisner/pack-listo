import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    text: "Click Me",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// visual = "primary",
// width = "full",
// size = "medium",
// type = "button",
// text = "",
// isLoading = false,
// loadingText = "",
// iconLeft,
// iconRight,
// disabled,

export const Hovered: Story = {
  parameters: {
    pseudo: {
      hover: true,
    },
  },
};

export const Focused: Story = {
  parameters: {
    pseudo: {
      focus: true,
    },
  },
};

export const Active: Story = {
  parameters: {
    pseudo: {
      active: true,
    },
  },
};

// export const Disabled: Story = {
//   args: {
//     placeholder: "Disabled input",
//     disabled: true,
//   },
// };

// export const Error: Story = {
//   args: {
//     placeholder: "Enter your e-mail",
//     hasError: true,
//   },
// };

// export const Success: Story = {
//   args: {
//     placeholder: "Looks good!",
//     hasSuccess: true,
//   },
// };
