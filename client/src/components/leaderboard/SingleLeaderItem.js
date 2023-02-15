import React from "react";
import { useSelector } from "react-redux";
import "./SingleLeaderItem.scss";

const SingleLeaderItem = (props) => {
  const authEmail = useSelector((state) => state.auth.email);
  const user = props.item;
  const total = props.item.totalexpense || 0;
  return (
    <li className="single-list-item-leaderboard">
      <h4
        className={
          authEmail === user.email
            ? "premium-user-mail-container"
            : "non-premium-mail-container"
        }
      >
        {user.name}
      </h4>
      <h6
        className={
          authEmail === user.email
            ? "premium-user-mail-container"
            : "non-premium-mail-container"
        }
      >
        {user.email}
      </h6>
      <h5
        className={
          authEmail === user.email
            ? "premium-user-mail-container"
            : "non-premium-mail-container"
        }
      >
        {total}
      </h5>
    </li>
  );
};

export default SingleLeaderItem;
