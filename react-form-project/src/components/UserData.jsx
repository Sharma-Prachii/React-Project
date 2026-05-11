import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ProfileCard from "./ProfileCard";

const UserData = () => {

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);


  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (currentPage) => {

    setLoading(true);

    try {

      console.log("TOKEN:", localStorage.getItem("token"));

      const response = await fetch(
        `http://localhost:3000/api/users?page=${currentPage}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (response.ok && data.data) {

        setUsers(data.data);
        setTotalPages(data.totalPages || 1);

      } else {

        setUsers([]);

      }

    } catch (err) {

      console.error("Error fetching users:", err);

    } finally {

      setLoading(false);

    }
  };

  const fetchSearchedUsers = async (value) => {

    try {

      const response = await fetch(
        `http://localhost:3000/api/users/search?search=${value}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data.data);
      }

    } catch (error) {

      console.error(error);

    }
  };

  // Debounce 
  useEffect(() => {

    const timer = setTimeout(() => {

      if (search.trim() === "") {

        fetchUsers(page);
        return;
      }

      if (search
        
        .trim().length >= 3) {

        fetchSearchedUsers(search);

      }

    }, 500);

    return () => clearTimeout(timer);

  }, [search, page]);

  const handleDelete = async (id) =>{
    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    try {

      const res = await fetch(
        `http://localhost:3000/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      fetchUsers(page);

      alert("User deleted");

    } catch (err) {

      console.error(err);

      alert("Server error");
    }
  };

  const handleEdit = (user) => {

    setSelectedUser(user);

    setShowEditModal(true);
  };

  return (
    <>
      <Navbar />

      <div className="form-container">

        <h2>User List</h2>

        <div className="search-container">

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

        </div>

        {loading ? (

          <p>Loading...</p>

        ) : (
          <>
            <table border="1" width="100%">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (

                  users.map((user) => (

                    <tr key={user._id}>

                      <td>
                        {user.firstName} {user.lastName}
                      </td>

                      <td>{user.email}</td>

                      <td>{user.phoneNo}</td>

                      <td>{user.companyName}</td>

                      <td>{user.role}</td>

                      <td className="action-buttons">

                        <button onClick={() => handleEdit(user)}>
                          Edit
                        </button>

                        <button onClick={() => handleDelete(user._id)}>
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      style={{ textAlign: "center" }}
                    >
                      No users found
                    </td>

                  </tr>

                )}
              </tbody>

            </table>

            {showEditModal && (

              <ProfileCard
                userData={selectedUser}
                isAdminEdit={true}
                onClose={() => {
                  setShowEditModal(false);
                  fetchUsers(page);
                }}
              />
            )}

            <div style={{ marginTop: "20px" }}>

              <button
                onClick={() => setPage(prev => prev - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      margin: "0 5px",
                      backgroundColor:
                        page === i + 1 ? "#0C67A0" : ""
                    }}
                  >
                    {i + 1}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserData;