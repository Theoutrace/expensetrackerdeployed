import Signup from "./pages/loginSignup/Signup";
import jwtDecode from "jwt-decode";
import "./App.scss";
import Login from "./pages/loginSignup/Login";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/header/Header";
import Expenses from "./pages/expenses/Expenses";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "./Store/reducers/auth-reducer";
import ResetPassword from "./pages/loginSignup/ResetPassword";

function App(props) {
  const [signup, setSignup] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    (function checkAuth() {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      if (token) {
        const userDetails = jwtDecode(token);
        dispatch(
          AuthActions.login({
            email: email,
            ispremiumuser: userDetails.ispremiumuser,
          })
        );
      }
    })();
  }, [auth.ispremiumuser, dispatch]);

  const toggleHandler = () => {
    setSignup((p) => !p);
  };
  return (
    <div className="app-component">
      <Header />
      <Routes>
        {!auth.email ? (
          <Route
            path="login"
            element={
              signup ? (
                <Signup fun={toggleHandler} />
              ) : (
                <Login modal={props.modal} fun={toggleHandler} />
              )
            }
          />
        ) : (
          <Route path="/expenses/*" element={<Expenses />} />
        )}
        <Route path="/" element={<h1>This is Home Page!</h1>} />
        <Route path="/password/resetpassword/:id" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
