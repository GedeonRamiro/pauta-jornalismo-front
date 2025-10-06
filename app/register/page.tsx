import CreateAccount from "../components/Account/CreateAccount";
import Start from "../components/Start";

export default function Register() {
  return <Start accountProps={<CreateAccount />} />;
}
