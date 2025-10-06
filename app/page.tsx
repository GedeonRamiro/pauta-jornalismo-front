import Login from "./components/Account/Login";
import Start from "./components/Start";

export default function Home() {
  return <Start accountProps={<Login />} />;
}
