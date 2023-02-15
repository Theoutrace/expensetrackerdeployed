import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthActions } from "../../Store/reducers/auth-reducer";
import jwtDecode from "jwt-decode";
import lineDeco from "./images/img1.webp";
import "./Login.scss";
import ForgotPassword from "../../components/login/ForgotPassword";

const Login = (props) => {
  const emailInputRef = useRef();
  const passwordlInputRef = useRef();
  const dispatch = useDispatch();
  const history = useNavigate();

  const formSumbitHandler = (e) => {
    e.preventDefault();
    const Obj = {
      email: emailInputRef.current.value,
      password: passwordlInputRef.current.value,
    };
    // console.log(Obj);

    (async function loginHandler() {
      try {
        const response = await fetch(`http://localhost:3001/user/login`, {
          method: "POST",
          body: JSON.stringify({
            email: Obj.email,
            password: Obj.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        // console.log(response);
        if (response.status === 200) {
          const data = await response.json();
          // console.log(data);
          localStorage.setItem("email", data.user.email);
          localStorage.setItem("token", data.token);
          const userDetails = jwtDecode(data.token);
          dispatch(
            AuthActions.login({
              email: data.user.email,
              ispremiumuser: userDetails.ispremiumuser,
            })
          );
          history("/expenses");
        } else if (response.status !== 200) {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  };

  const formToggleHandler = () => {
    props.fun();
  };

  const forgotPasswordHandler = () => {
    props.modal.render(<ForgotPassword modal={props.modal} />);
  };

  return (
    <div>
      <div className="login-form-container">
        <div className="login-form-container-2">
          <img src={lineDeco} alt="" className="lineDeco-img-container" />
          <h3 className="password-cls-for-pos">
            Your <span>password</span> was encrypted. <br /> if you forget it,
            it <span>can't</span> be retrieved. <br /> So just{" "}
            <span>reset your password</span> here...
          </h3>
          <form onSubmit={formSumbitHandler}>
            <h2>Login</h2>
            <input
              ref={emailInputRef}
              placeholder="Email"
              required
              type="email"
            />
            <input
              ref={passwordlInputRef}
              placeholder="Password"
              required
              type="password"
            />
            <p>
              Forgot Password ?
              <span onClick={forgotPasswordHandler}> Click</span>
            </p>
            <button>Login</button>
          </form>
        </div>
        <div className="toggle-text-cntnr">
          Don't Have An Account ?
          <span onClick={formToggleHandler}> Signup</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
