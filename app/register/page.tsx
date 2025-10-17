import CreateAccount from "../components/Account/CreateAccount";
import Start from "../components/Account/InfoAccount";

export default function Register() {
  return <Start accountProps={<CreateAccount />} />;
}
