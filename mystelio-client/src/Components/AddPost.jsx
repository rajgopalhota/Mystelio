import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "./../UrlHelper";
import { usePost } from "../Context/PostContext";

export default function AddPost() {
  const auth = useAuth();
  const postContext = usePost();

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
    const tagsArray = formData.tags.match(/#(\w+)/g) || [];
    const tagsJSON = JSON.stringify(tagsArray);

    // Create a FormData object to handle file uploads
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.postContent);
    formDataToSend.append("tags", tagsJSON);
    formDataToSend.append("image", formData.image);

    postContext.addPost(formDataToSend);

    setFormData({
      title: "",
      postContent: "",
      image: null,
      tags: "",
    });
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
                <div className="fileInputDiv">
                  <label htmlFor="imageUpload">
                    <i class="fa-solid fa-cloud-arrow-up"></i>&nbsp;Upload Image
                  </label>
                  <input
                    id="imageUpload"
                    className="imageFile"
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleInputChange}
                  />
                </div>
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
