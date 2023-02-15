import React, { useRef } from "react";
import "./Signup.scss";
import curveLine from "./images/img1.webp";
import curveLine2 from "./images/img2.webp";
import { useDispatch } from "react-redux";
import { AuthActions } from "../../Store/reducers/auth-reducer";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Signup = (props) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const history = useNavigate();

  const formSumbitHandler = (e) => {
    e.preventDefault();

    const Obj = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    (async function postFun() {
      const response = await fetch(`http://localhost:3001/user/signup`, {
        method: "POST",
        body: JSON.stringify({
          name: Obj.name,
          email: Obj.email,
          password: Obj.password,
        }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());
      // console.log(response);
      if (response.user.email) {
        localStorage.setItem("email", response.user.email);
        localStorage.setItem("token", response.token);
        const userDetails = jwtDecode(response.token);
        dispatch(
          AuthActions.login({
            email: response.user.email,
            ispremiumuser: userDetails.ispremiumuser,
          })
        );
        history("/expenses");
      }
    })();
  };

  const formToggleHandler = () => {
    props.fun();
  };

  return (
    <div>
      <div className="signup-form-container">
        <div className="signup-form-container-2">
          <img className="line-curve-deco" src={curveLine} alt="" />
          <img className="line-curve-deco2" src={curveLine2} alt="" />
          <h3 className="pass-cls-for-pos">
            Password gets through
            <br /> <span>hash encryption</span> before
            <br /> saving to the database...
          </h3>
          <h3 className="email-cls-for-pos">
            Email is checked
            <br /> for <span>uniqueness...</span>
          </h3>
          <form onSubmit={formSumbitHandler}>
            <h2>SignUp</h2>
            <input ref={nameRef} placeholder="Name" required type="text" />
            <input ref={emailRef} placeholder="Email" required type="email" />
            <input
              ref={passwordRef}
              placeholder="Password"
              required
              type="password"
            />
            <button>Register</button>
          </form>
        </div>
        <div className="toggle-text-cntnr">
          Already Have An Account ?
          <span onClick={formToggleHandler}> Login</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
