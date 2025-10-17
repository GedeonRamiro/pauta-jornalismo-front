import Start from "../components/Account/InfoAccount";
import LoginForm from "../components/Account/LoginForm";

export default function Login() {
  return <Start accountProps={<LoginForm />} />;
}
