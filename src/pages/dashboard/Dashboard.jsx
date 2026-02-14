import React, { useState } from "react";
import "../../App.css";
import List from "./List";
import CreateResumeBtn from "./CreateResumeBtn";
import { Search } from "lucide-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="dashboard-content">
        {/* Centered stack for Search and Create button */}
        <div className="dashboard-header-stack">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search resumes..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <CreateResumeBtn />
        </div>

        <List searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Dashboard;
