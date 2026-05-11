import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProfileCard = ({ onClose, setUser: setGlobalUser, userData }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    companyName: "",
    role: "",
    image: ""
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setPreview(userData.image || "");
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setPreview(storedUser.image || "");
      }
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveImage = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/users/remove-profile-image",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to remove image");
        return;
      }

      setUser(data.data);
      setPreview("");

      if (setGlobalUser) {
        setGlobalUser(data.data);
      }

      localStorage.setItem("user", JSON.stringify(data.data));

      alert("Profile image removed");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("phoneNo", user.phoneNo);
      formData.append("companyName", user.companyName);

      if (file) {
        formData.append("image", file);
      }

      const res = await fetch("http://localhost:3000/api/users/updateUser", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      const updatedUser = data.data;

      setUser(updatedUser);
      setPreview(updatedUser.image);

      if (setGlobalUser) {
        setGlobalUser(updatedUser);
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile Updated Successfully");
      onClose();

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>

        <h2>Edit Profile</h2>

        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <img
            src={
              preview ||
              user.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            width="100"
            height="100"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />

          {user.image && (
          <button
          className="remove-image-btn"
          onClick={handleRemoveImage}
          >
          Remove
        </button>
       )}

          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>First Name</label>
          <input name="firstName" value={user.firstName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input name="lastName" value={user.lastName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={user.email} disabled />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input name="phoneNo" value={user.phoneNo} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input name="companyName" value={user.companyName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input value={user.role} disabled />
        </div>

        <div className="profile-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
};

export default ProfileCard;