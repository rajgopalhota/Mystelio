import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";

export default function AddPost() {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    title: "", // Add a title field
    postContent: "", // Add a postContent field
    image: null, // Add an image field
    tags: "", // Add a tags field
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
      // Access formData.title, formData.postContent, formData.image, formData.tags
      console.log("Form Data:", formData);

      setFormData({
        title: "",
        postContent: "",
        image: null,
        tags: "",
      });
    } catch (error) {
      // Handle errors, you can console.log them for now
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
                />
              </div>
            </div>

            <input
              value="POST"
              type="submit"
              className="formInputBox-button"
            />
          </form>
        </div>
      </div>
    </>
  );
}
