import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExpenseActions } from "../../Store/reducers/expense-reducer";
import dltBtn from "./images/deleteBtn.png";
import "./SingleExpense.scss";

const SingleExpense = (props) => {
  const [showBtn, setShowBtn] = useState(false);
  const expenseItems = useSelector((state) => state.expense.expenses);
  const dispatch = useDispatch();

  const deleteExpenseItem = async () => {
    const expenseId = props.item.id;
    await fetch(`http://localhost:3001/expense/${expenseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
    });

    const remainingExpenses = expenseItems.filter(
      (item) => item.id !== expenseId
    );
    dispatch(ExpenseActions.addExpense(remainingExpenses));
  };

  const showDeleteEditHandler = () => {
    setShowBtn((p) => !p);
  };
  return (
    <div
      className="single-expense-container-aft-submit"
      onMouseEnter={showDeleteEditHandler}
      onMouseLeave={showDeleteEditHandler}
    >
      <div className="item-category-cont">
        <h3>{props.item.category}</h3>
      </div>
      <div className="item-amt-cont">
        <p>Amount </p> <h4>Rs. {props.item.amount}</h4>
      </div>
      <div className="item-DESC-cont">
        <p>Description</p>
        <h6>{props.item.description}</h6>
      </div>
      {showBtn && (
        <button onClick={deleteExpenseItem}>
          <img src={dltBtn} alt="" />
        </button>
      )}
    </div>
  );
};

export default SingleExpense;
