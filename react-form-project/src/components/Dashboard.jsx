import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <div className="form-container">
        <h1>Welcome..</h1>

        <h2>Dashboard</h2>
         {/* const storedUser = JSON.parse(localStorage.getItem("user"));
         const role = storedUser?.role;
  
        {role === "admin" && (
          <button onClick={() => navigate("/user-data")}>
            Show Users
          </button>
        )} */}
      </div>
    </>
  );
};

export default Dashboard;