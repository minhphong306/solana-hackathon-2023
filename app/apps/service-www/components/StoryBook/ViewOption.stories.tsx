import ViewOptiom from '../ViewOption';
import {ComponentStory} from "@storybook/react";
import React from "react";

// export default {
//   title: 'Input',
//   component: ViewOptiom,
// };

const Template: ComponentStory<typeof ViewOptiom> = (args) => <ViewOptiom {...args} />;

export const viewOption = Template.bind({});
viewOption.parameters = {
};
