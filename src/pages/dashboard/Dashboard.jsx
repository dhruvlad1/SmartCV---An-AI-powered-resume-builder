import React from "react";
import "../../App.css";
import List from "./List";
import CreateResumeBtn from "./CreateResumeBtn";

const Dashboard = () => {
  return (
    <div>
      <div className="dashboard-content">
        <CreateResumeBtn />
        <List />
      </div>
    </div>
  );
};

export default Dashboard;
