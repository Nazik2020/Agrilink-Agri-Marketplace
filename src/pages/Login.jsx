import { useState } from "react";

import LoginPage from "../components/Login/LoginPage";

function Login() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <LoginPage />
      </div>
    </>
  );
}

export default Login;
