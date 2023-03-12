import * as React from 'react';
import { render } from '@testing-library/react';

import PasswordTextfield from "../../components/PasswordTextfield";

describe('PasswordTextfield', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PasswordTextfield value={'dungnt'} label={'unit test'} bgColor={'#130C35'} onChange={()=>console.log('PasswordTextfield working')}  />);
    expect(baseElement).toBeTruthy();
  });
});
