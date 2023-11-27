import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";
import axios from "./../UrlHelper";

export default function AddPost() {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    postContent: "",
    image: null,
    tags: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? e.target.files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.match(/#(\w+)/g) || [];
      const tagsJSON = JSON.stringify(tagsArray);

      // Create a FormData object to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.postContent);
      formDataToSend.append("tags", tagsJSON);
      formDataToSend.append("image", formData.image);

      const authToken = auth.user.token;
      // Make a POST request using Axios
      const response = await axios.post("/posts/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
          Authorization: authToken, // Add the authentication token
        },
      });

      // Log the response from the server
      console.log("Server Response:", response.data);

      // Clear the form fields
      setFormData({
        title: "",
        postContent: "",
        image: null,
        tags: "",
      });
    } catch (error) {
      console.error("Post Submission Error:", error.message);
      toast.error("Post Failed");
    }
  };

  return (
    <>
      <div className="formInputBox postBox">
        <div className="container">
          <div className="heading">
            <h1 className="title">
              <i class="fa-solid fa-earth-americas"></i>&nbsp;What is Happening?
            </h1>
          </div>
          <form className="form" onSubmit={handleFormSubmit}>
            <div className="input-box">
              <label>
                <i class="fa-brands fa-battle-net"></i>&nbsp;Enter Title
              </label>
              <input
                required=""
                placeholder="Add a quick title to your post"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <label>
                <i class="fa-solid fa-pen-nib"></i>&nbsp;Add Post
              </label>
              <textarea
                required=""
                placeholder="Write something............"
                name="postContent"
                value={formData.postContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-box address">
              <label>
                <i className="fa-solid fa-folder-open"></i>&nbsp;Add Image and
                Tags
              </label>
              <div className="column">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleInputChange}
                />
                <input
                  required=""
                  placeholder="Enter tags #mystelio"
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  pattern="(?:#(\w+)(?:(?!#)\s*|$))+"
                  title="Tags must start with '#' and have no spaces in between"
                />
              </div>
            </div>

            <input value="POST" type="submit" className="formInputBox-button" />
          </form>
        </div>
      </div>
    </>
  );
}
