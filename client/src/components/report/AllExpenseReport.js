import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExpenseActions } from "../../Store/reducers/expense-reducer";
import "./AllExpenseReport.scss";
import SingleVersionItem from "./SingleVersionItem";

const AllExpenseReport = () => {
  const dispatch = useDispatch();
  const version = useSelector((state) => state.expense.version);
  console.log(version);
  useEffect(() => {
    (async function fetchData() {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/expense/download-expenses/allurl`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );
      const res = await response.json();
      dispatch(ExpenseActions.addVersion(res.urls));
    })();
  }, []);

  return (
    <div className="all-exp-report-container">
      {version.map((item) => (
        <div className="inin-filename-container">
          <SingleVersionItem item={item} />
        </div>
      ))}
    </div>
  );
};

export default AllExpenseReport;
