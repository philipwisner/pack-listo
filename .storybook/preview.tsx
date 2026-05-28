import type { Preview } from "@storybook/nextjs-vite";
// @ts-ignore
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", title: "Light mode" },
        { value: "dark", title: "Dark mode" },
      ],
      showName: true,
    },
  },
};

const applyThemeClass = (theme: string) => {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
};

export const decorators = [
  (Story: any, context: any) => {
    applyThemeClass(context.globals.theme);
    return <Story />;
  },
];

export default preview;
