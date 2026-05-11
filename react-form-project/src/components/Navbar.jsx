import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";

const Navbar = ({ user = {}, setUser }) => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const currentUser =
    user && Object.keys(user).length > 0 ? user : storedUser;

  const [open, setOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="navbar">
      <div className="profile-wrapper">

        <img
          src={
            currentUser?.image && currentUser.image !== ""
              ? currentUser.image
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          className="profile-icon"
          onClick={() => {
            setOpen(!open);
            setShowPasswordForm(false);
          }}
          key={currentUser?.image}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer"
          }}
        />

        {open && (
          <div className="profile-box">

            <h4>
              {currentUser?.firstName
                ? `${currentUser.firstName} ${currentUser.lastName || ""}`
                : "User"}
            </h4>

            <button
              className="small-btn"
              onClick={() => {
                setShowProfileModal(true);
                setOpen(false);
              }}
            >
              View Profile
            </button>

            <button className="small-btn">Settings</button>

            <button
              className="small-btn"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Manage Password
            </button>

            {showPasswordForm && (
              <div className="password-form">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>

          </div>
        )}

        {showProfileModal && (
          <ProfileCard
            onClose={() => setShowProfileModal(false)}
            setUser={setUser}
          />
        )}

      </div>
    </div>
  );
};

export default Navbar;