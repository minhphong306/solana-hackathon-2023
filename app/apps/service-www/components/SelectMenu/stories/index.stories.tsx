import * as React from 'react';
import SelectMenu from '../index';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'SelectMenu',
  component: SelectMenu
};

export const Default = (args) => {
  const [value, setValue] = React.useState(0);

  const handleOnChange = (idx) => {
    setValue(idx);
  };
  return (
    <SelectMenu
      selected={value}
      onSelectChange={handleOnChange}
      {...args}
    />
  );
};

Default.args = {
  label: 'Label',
  options: ['Option 1', 'Option 2', 'Option 3'],
};
