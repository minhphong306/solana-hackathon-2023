import LoginLayout from '../components/Layout/Login';
import CreateAccountLayout from '../components/Layout/Login/CreateAccountLayout';
import Verify from '../containers/Account/VerifyAccount';

export default function VerifyPage() {
  return (
    <LoginLayout>
      <CreateAccountLayout>
        <Verify />
      </CreateAccountLayout>
    </LoginLayout>
  );
}
