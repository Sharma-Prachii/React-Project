import React, { useState } from "react";
import axios from "axios";

const UpdateProfile = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      console.log(res.data);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <div>
            <img
              src={preview}
              alt="preview"
              width="150"
              style={{ marginTop: "10px" }}
            />
          </div>
        )}

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UpdateProfile;