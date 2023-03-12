import LoginLayout from '../components/Layout/Login';
import CreateAccountLayout from '../components/Layout/Login/CreateAccountLayout';
import LinkAccount from '../containers/Account/LinkAccount';

export default function CreateAccountPage() {
  return (
    <LoginLayout>
      <CreateAccountLayout>
        <LinkAccount />
      </CreateAccountLayout>
    </LoginLayout>
  );
}
