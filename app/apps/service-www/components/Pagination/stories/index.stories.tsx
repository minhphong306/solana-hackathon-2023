import * as React from 'react';
import Pagination from '../index';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Pagination',
  component: Pagination,
};

export const Default = (args) => {
  const [page, setPage] = React.useState(1);
  return (
    <Pagination page={page} onPageChange={(e, p) => setPage(p)} {...args} />
  );
};

Default.args = {
  count: 100,
};
