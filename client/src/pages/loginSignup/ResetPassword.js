import React, { useState } from "react";
import "./ResetPassword.scss";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setreenterPassword] = useState("");
  const { id } = useParams();

  const newPasswordHandler = (e) => {
    setNewPassword(() => e.target.value);
  };
  const reenterPasswordHandler = (e) => {
    setreenterPassword(() => e.target.value);
    setError(() => false);
  };

  const resetpasswordSubmithandler = async (e) => {
    e.preventDefault();
    if (newPassword === reenterPassword) {
      const resetPasswordObj = { newPassword: newPassword };

      const resetApi = `http://localhost:3001/password/resetpassword/${id}`;

      const response = await fetch(resetApi, {
        method: "POST",
        body: JSON.stringify(resetPasswordObj),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const res = await response.json();
        setSuccessMsg(() => <h4>{res.message}</h4>);
      } else {
        const res = await response.json();
        setSuccessMsg(() => <h3>{`${res.message} kindly login`}</h3>);
      }
    } else {
      setError(() => true);
    }
  };

  return (
    <div className="reset-passsword-container">
      <form onSubmit={resetpasswordSubmithandler}>
        {!successMsg ? (
          <>
            <h2>Reset Your Password</h2>
            <input
              placeholder="New Password"
              onChange={newPasswordHandler}
              value={newPassword}
              type="password"
            />
            <input
              placeholder="Re-enter Password"
              onChange={reenterPasswordHandler}
              value={reenterPassword}
              className={!error ? "" : "error-password-not-matched"}
              type="password"
            />
            <button>Reset</button>
          </>
        ) : (
          successMsg
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
