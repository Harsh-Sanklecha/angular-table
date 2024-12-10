import { Meta, StoryObj } from "@storybook/angular";
import { InnTableComponent } from "./inn-table.component";

const meta: Meta<InnTableComponent> = {
    title: "Inn-Table",
    component: InnTableComponent,
    tags: ['autodocs'],
    argTypes: {
        // props
    },
};
export default meta;
type Story = StoryObj<InnTableComponent>;
export const Default: Story = {
    args: {},
};
