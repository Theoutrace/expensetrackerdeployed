import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleExpense from "../../components/expenses/SingleExpense";
import { AuthActions } from "../../Store/reducers/auth-reducer";
import { ExpenseActions } from "../../Store/reducers/expense-reducer";
import warrenImg from "./images/warren.png";
import "./Expenses.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AllExpenseReport from "../../components/report/AllExpenseReport";
import Pagination from "../../components/pagination/Pagination";

const Expenses = () => {
  const expenses = useSelector((state) => state.expense.expenses);
  const pagination = useSelector((state) => state.expense.pagination);
  const perPage = useSelector((state) => state.expense.perPage);
  const page = useSelector((state) => state.expense.page);
  const auth = useSelector((state) => state.auth);
  const amountInputRef = useRef();
  const categoryInputRef = useRef();
  const descriptionInputRef = useRef();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  if (!page) {
    localStorage.setItem("page", 1);
  }

  const perPageSet = localStorage.getItem("perPage");
  if (perPageSet) {
    dispatch(ExpenseActions.getPerPage(perPageSet));
  }

  // request
  useEffect(() => {
    (async function fetchExpenses() {
      const response = await fetch(`http://35.78.181.44:3001/expense/${page}`, {
        method: "POST",
        body: JSON.stringify({
          itemPerPage: perPage || localStorage.getItem("perPage"),
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }).then((res) => res.json());
      dispatch(ExpenseActions.addExpense(response.expenses));
      dispatch(ExpenseActions.getPagination(response.info));
    })();
  }, [expenses.length, dispatch, token, page, perPage]);

  //items per page
  const itemPerPageHandler = (e) => {
    dispatch(ExpenseActions.getPerPage(e.target.value));
    localStorage.setItem("perPage", e.target.value);
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    dispatch(AuthActions.login(email));
  }, [auth.email, dispatch]);

  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (categoryInputRef.current.value === "Category") {
      alert("Select a category");
    } else {
      const ExpObj = {
        amount: amountInputRef.current.value,
        category: categoryInputRef.current.value,
        description: descriptionInputRef.current.value,
      };

      (async function postExpense() {
        const response = await fetch(
          `http://35.78.181.44:3001/expense/add-expense`,
          {
            method: "POST",
            body: JSON.stringify({
              amount: ExpObj.amount,
              category: ExpObj.category,
              description: ExpObj.description,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        ).then((res) => res.json());
        dispatch(
          ExpenseActions.addExpense([...expenses, { ...response.expense }])
        );
      })();

      amountInputRef.current.value = "";
      categoryInputRef.current.value = "";
      descriptionInputRef.current.value = "";
    }
  };
  return (
    <div className="expense-page-container">
      <div className="sidebar-component-container">
        <Sidebar />
      </div>
      <div className="expense-page-comp-container">
        <form onSubmit={formSubmitHandler} className="exp-pge-form-compone">
          <div className="pointer-to-form-cnt"></div>
          <input ref={amountInputRef} placeholder="Amount" type="number" />
          <input
            ref={descriptionInputRef}
            placeholder="Description"
            type="text"
          />
          <select
            ref={categoryInputRef}
            required
            className="category-cat-tag-select"
          >
            <option>Category</option>
            <option>Food</option>
            <option>Petrol</option>
            <option>Party</option>
            <option>Savings</option>
            <option>Lendings</option>
          </select>
          <button>+ Add to list</button>
        </form>
        <div className="exp-containr-outer">
          <Routes>
            <Route path="/reports" element={<AllExpenseReport />} />
            <Route
              path="/"
              element={
                <div className="cnt-pge-cntnr-exp">
                  <div className="all-exp-cntnr">
                    {expenses.length > 0 ? (
                      expenses.map((item) => {
                        return (
                          <SingleExpense
                            key={item.id}
                            item={item}
                            token={token}
                          />
                        );
                      })
                    ) : (
                      <div className="no-expense-case-container">
                        <h2>Nothing to display!</h2>
                        <p>
                          ~ Do not save what is left after spending, but spend
                          what is left after saving ~
                        </p>
                        <img src={warrenImg} alt="" />
                      </div>
                    )}
                  </div>

                  {pagination ? (
                    <div className="pagination-pannel">
                      <Pagination info={pagination} />
                      <select onChange={itemPerPageHandler} value={perPage}>
                        <option selected>3</option>
                        <option>4</option>
                        <option>8</option>
                        <option>10</option>
                      </select>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
