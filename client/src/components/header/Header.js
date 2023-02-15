import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthActions } from "../../Store/reducers/auth-reducer";
import jwtDecode from "jwt-decode";
import "./Header.scss";
import logo from "./images/money-logo.png";
import newTag from "./images/new-tag.png";
import crownPremium from "./images/crown.png";

const Header = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const auth = useSelector((state) => state.auth);
  // console.log(auth);

  const logoutHandler = () => {
    dispatch(AuthActions.logout());
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    history("/");
  };

  const buyPremiumHandler = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3001/payment/buypremium`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        var options = {
          key: data.key_id,
          amount: data.order.amount,
          currency: data.order.currency,
          order_id: data.order.id,
          handler: async function (response) {
            const res = await fetch(
              `http://localhost:3001/payment/update-transaction-status`,
              {
                method: "POST",
                body: JSON.stringify({
                  order_id: options.order_id,
                  payment_id: response.razorpay_payment_id,
                  response: response,
                  data: data,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              }
            );

            if (res.ok) {
              // alert("You are a premium user now!");
              const response = await res.json();
              localStorage.setItem("token", response.token);
              const userDetails = jwtDecode(response.token);
              dispatch(
                AuthActions.login({
                  email: userDetails.email,
                  ispremiumuser: userDetails.ispremiumuser,
                })
              );
            }
          },
          prefill: {
            email: localStorage.getItem("email"),
            contact: "8085121735",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", async function (res) {
          await fetch(
            `http://localhost:3001/payment/update-transaction-status/failed`,
            {
              method: "POST",
              body: JSON.stringify({
                message: "Payment failed",
                options: options,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
        });

        razorpay.open();
      }
    } catch (error) {}
  };
  return (
    <div className="header-container-outer">
      <div className="nav-bar-container-header">
        <NavLink to="/" className="for-logo-of-app-container">
          <img src={logo} alt="" /> <h2>X-pen'ed</h2>
        </NavLink>

        {auth.email && (
          <NavLink
            to="/expenses"
            className={(status) =>
              status.isActive
                ? "exp-div-container-hdr-menu nav-menu-active"
                : "exp-div-container-hdr-menu nav-menu-not-active"
            }
          >
            <img src={newTag} alt="" />
            Expenses
          </NavLink>
        )}

        {auth.email && !auth.ispremiumuser && (
          <button to="/buy-premium" onClick={buyPremiumHandler}>
            <img src={crownPremium} alt="" />
            Get Premium
          </button>
        )}
      </div>

      <div className="login-logout-profile-btn-cntnr">
        {!auth.email && (
          <NavLink
            to="/login"
            className={(status) =>
              status.isActive ? "btn-active" : "btn-not-active"
            }
          >
            Login
          </NavLink>
        )}
        {auth.email && (
          <NavLink
            to=""
            className={(status) =>
              status.isActive ? "btn-active" : "btn-not-active"
            }
            onClick={logoutHandler}
          >
            Logout
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;
