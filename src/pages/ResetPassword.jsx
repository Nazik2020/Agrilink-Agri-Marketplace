"use client";

import { useState } from "react";
import ResetPasswordform from "../components/ResetPassword/ResetPasswordform";

function ResetPassword() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <ResetPasswordform />
    </div>
  );
}

export default ResetPassword;
