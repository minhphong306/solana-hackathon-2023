import * as React from 'react';
import GradientButton from '../GradientButton';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'GradientButton',
  component: GradientButton,
  args: {
    children: 'Click me!',
  },
  // decorators: [],
};

export const GradientButtonStory = ({ ...args }) => <GradientButton {...args} />;

GradientButtonStory.storyName = 'GradientButton';
