import { useState } from "react";

import ForgotPasswordform from "../components/ForgotPassword/ForgotPasswordform";

function ForgotPassword() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <ForgotPasswordform />
      </div>
    </>
  );
}

export default ForgotPassword;
