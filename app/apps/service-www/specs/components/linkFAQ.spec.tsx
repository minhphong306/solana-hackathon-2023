import * as React from 'react';
import {render} from '@testing-library/react';

import LinkFaq from "../../components/Faq/LinkFaq";

describe('LinkFaq', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<LinkFaq/>);
    expect(baseElement).toBeTruthy();
  });
});
