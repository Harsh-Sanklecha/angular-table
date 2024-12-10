import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: ['../src/app/**/*.stories.ts'],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
};
export default config;
