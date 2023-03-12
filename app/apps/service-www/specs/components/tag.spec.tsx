import * as React from 'react';
import {render} from '@testing-library/react';

import Card from "../../components/Card/Card";

describe('Card', () => {
  it('should render successfully', () => {
    const {baseElement} = render(
      <Card>
        <>Card is working</>
      </Card>);
    expect(baseElement).toBeTruthy();
  });
});
