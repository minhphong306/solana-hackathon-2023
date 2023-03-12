import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SearchMenu from '../SearchMenu';

export default {

  title: 'Input',
  component: SearchMenu,
} as ComponentMeta<typeof SearchMenu>;

const Template: ComponentStory<typeof SearchMenu> = (args) => <SearchMenu {...args} />;

const partOptions = ['Single part', 'Robot'];


export const searchMenu = Template.bind({});

searchMenu.args = {option: partOptions, name:'type'
};
