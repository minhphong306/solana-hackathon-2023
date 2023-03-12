import * as React from "react";
import TagBodyPart from "../TagBodyPart";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "TagBodyPart",
  component: TagBodyPart,
  argTypes: {
    type: {
      options: ['uncommon', 'common', 'rare', 'epic', 'mythical', 'legendary'],
      control: { type: 'select' },
    },
  },
  // decorators: [],
};

export const TagBodyPartStory = ({ ...args }) => <TagBodyPart {...args} />;

TagBodyPartStory.storyName = "TagBodyPart";
