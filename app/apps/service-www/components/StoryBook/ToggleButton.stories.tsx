import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CustomToggleButton from '../ToggleButton';

export default {
  title: 'Input',
  component: CustomToggleButton,
} as ComponentMeta<typeof CustomToggleButton>;

const Template: ComponentStory<typeof CustomToggleButton> = (args) => <CustomToggleButton {...args} />;

export const toogleButton = Template.bind({});

toogleButton.args = {
  name: 'Test'
};
