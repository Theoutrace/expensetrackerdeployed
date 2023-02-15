import React from "react";
import { useDispatch } from "react-redux";
import { ExpenseActions } from "../../Store/reducers/expense-reducer";
import "./Pagination.scss";

const Pagination = (props) => {
  const dispatch = useDispatch();
  // console.log(props.info);
  const val = props.info;
  return (
    <div className="pagination-component-container">
      <ul>
        <li
          className="next-li-btn"
          onClick={() =>
            dispatch(
              ExpenseActions.getpage(val.hasPreviousPage ? val.previousPage : 1)
            )
          }
        >
          Previous
        </li>

        {val.hasPreviousPage && (
          <li
            onClick={() => dispatch(ExpenseActions.getpage(val.previousPage))}
          >
            {val.previousPage}
          </li>
        )}
        <li
          className="currentPage-container-pageno"
          onClick={() => dispatch(ExpenseActions.getpage(val.currentPage))}
        >
          {val.currentPage}
        </li>
        {val.hasNextPage && (
          <li onClick={() => dispatch(ExpenseActions.getpage(val.nextPage))}>
            {val.nextPage}
          </li>
        )}
        {val.hasNextPage && val.nxtnxtPage < val.lastPage && (
          <li onClick={() => dispatch(ExpenseActions.getpage(val.nxtnxtPage))}>
            {val.nxtnxtPage}
          </li>
        )}
        {val.lastPage - val.nextPage > 1 &&
          val.lastPage - val.nxtnxtPage > 1 && <li>...</li>}
        {val.lastPage - val.nextPage > 0 && (
          <li onClick={() => dispatch(ExpenseActions.getpage(val.lastPage))}>
            {val.lastPage}
          </li>
        )}

        <li
          className="next-li-btn"
          value={val.nextPage}
          onClick={() =>
            dispatch(
              ExpenseActions.getpage(
                val.hasNextPage ? val.nextPage : val.lastPage
              )
            )
          }
        >
          Next
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
