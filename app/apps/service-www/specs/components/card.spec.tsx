import * as React from 'react';
import {render} from '@testing-library/react';

import TagBodyPart from "../../components/Tag/TagBodyPart";

describe('TagBodyPart', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<TagBodyPart/>);
    expect(baseElement).toBeTruthy();
  });
});
