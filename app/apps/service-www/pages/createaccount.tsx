import CreateAccount from '../containers/Account/CreateAccount';
import LoginLayout from '../components/Layout/Login';
import CreateAccountLayout from '../components/Layout/Login/CreateAccountLayout';

export default function CreateAccountPage() {
  return (
    <LoginLayout>
      <CreateAccountLayout>
        <CreateAccount />
      </CreateAccountLayout>
    </LoginLayout>
  );
}
