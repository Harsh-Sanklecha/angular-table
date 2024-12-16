import { Meta, StoryObj } from "@storybook/angular";
import { InnTable } from "./inn-table.component";

const meta: Meta<InnTable> = {
    title: "Inn-Table",
    component: InnTable,
    tags: ['autodocs'],
    argTypes: {
        // props
    },
};
export default meta;
type Story = StoryObj<InnTable>;
export const Default: Story = {
    args: {},
};
