import React from "react";
import { useSelector } from "react-redux";
import SingleLeaderItem from "./SingleLeaderItem";
import "./Leaderboard.scss";

const Leaderboard = () => {
  const leaderboard = useSelector((state) => state.expense.leaderboard);
  return (
    <ul className="leaderboard-component-container-dv-cnt">
      {leaderboard.map((item) => {
        return <SingleLeaderItem key={item.id} item={item} />;
      })}
    </ul>
  );
};

export default Leaderboard;
