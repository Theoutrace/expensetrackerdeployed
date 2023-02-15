import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.scss";
import userImg from "./images/user.png";
import dropIcon from "./images/dropicon.png";
import downloadIcon from "./images/downloadIcon2.png";
import changePasswordIcon from "./images/changePasswordIcon.png";
import Leaderboard from "../leaderboard/Leaderboard";
import { ExpenseActions } from "../../Store/reducers/expense-reducer";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const auth = useSelector((state) => state.auth);
  const expense = useSelector((state) => state.expense);
  const dispatch = useDispatch();
  const version = useSelector((state) => state.expense.version);

  const token = localStorage.getItem("token");
  useEffect(() => {
    (async function fetchLeaderboard() {
      const response = await fetch(
        `http://35.78.181.44:3001/user/leaderboard`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );
      const res = await response.json();
      dispatch(ExpenseActions.addLeaderboard(res.data));
    })();
  }, [expense.expenses.length, token, showLeaderboard, dispatch]);

  //leaderboard toggle
  const showLeaderBoardHandler = () => {
    setShowLeaderboard((p) => !p);
  };

  const downloadExpenseReportHandler = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://35.78.181.44:3001/expense/download-expenses`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token },
      }
    );

    const res = await response.json();
    console.log(res);
    dispatch(ExpenseActions.addVersion([...version, res.downloadurlData]));
    console.log(res.fileURL);
    const a = document.createElement("a");
    a.href = res.fileURL;
    console.log("link:  ", a);
    a.download = "file.csv";
    a.click();
  };

  return (
    <div className="sidebar-outer-div-containing-leader-sidebar">
      <div className="Sidebar-container">
        <div className="user-img-txt-contnr">
          <img src={userImg} alt="" />
          <h4>{auth.email}</h4>
        </div>
        <ul>
          <li className="li-li-sidebar-menu">
            Change Password
            <img
              className="change-pass-Icon-leaderboard"
              src={changePasswordIcon}
              alt=""
            />
          </li>
          {auth.ispremiumuser && (
            <NavLink to="reports">
              <li className="li-li-report-sidebar">
                <span>Check Reports</span>
                <img
                  className="download-Icon-leaderboard"
                  src={downloadIcon}
                  alt=""
                  onClick={downloadExpenseReportHandler}
                />
              </li>
            </NavLink>
          )}
          {auth.ispremiumuser && (
            <li className="li-li-sidebar-menu" onClick={showLeaderBoardHandler}>
              Leaderboard
              <img
                className={
                  showLeaderboard
                    ? "drop-logo-leaderboard"
                    : "drop-logo-leaderboard-flip"
                }
                src={dropIcon}
                alt=""
              />
            </li>
          )}
        </ul>
      </div>
      {showLeaderboard && (
        <div className="leaderboardContainer">
          <h3>Leaderboard</h3>
          <Leaderboard />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
