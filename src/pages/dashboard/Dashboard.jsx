import React from "react";
import "../../App.css";
import Navbar from "./Navbar";
import List from "./List";
import CreateResumeBtn from "./CreateResumeBtn";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="dashboard-content">
        <CreateResumeBtn />
        <List />
      </div>
    </div>
  );
};

export default Dashboard;
