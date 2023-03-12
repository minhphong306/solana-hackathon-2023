import * as React from 'react';
import { logPageViewToGA } from './utils';

export default function useTracking(): void {
  React.useEffect(() => {
    logPageViewToGA();
  }, []);
}
