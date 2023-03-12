import setupApollo from '@mp-workspace/ui-next-apollo-react-component';
import setupCache from './setupCache';

const withApollo = setupApollo({
  cache: setupCache()
});

export default withApollo;
