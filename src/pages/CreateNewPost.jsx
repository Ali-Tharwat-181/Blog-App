import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

export default function CreateNewPost(props) {
  const { posts, handleAddNewPost, handleUpdatePost } = props;

  const navigate = useNavigate();
  const { id } = useParams();

  const mood = id === "new" ? "add" : "edit";

  const [form, setForm] = useState({
    title: "",
    body: "",
    coverImage: "",
  });

  useEffect(() => {
    if (posts.length && mood === "edit") {
      const post = posts.find((p) => String(p._id) === String(id));
      if (!post) {
        toast.error("Post not found!");
        navigate("/");
        return;
      }

      setForm({
        title: post.title || "",
        body: post.body || "",
        coverImage: post.coverImage || "",
      });
    }
  }, [id, posts, mood, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    // prepare object to send to DB
    const dataToSubmit = {
      title: form.title,
      body: form.body,
      coverImage: form.coverImage,
    };
    console.log(dataToSubmit.coverImage);
    // call backend
    try {
      const { data } = await axios.post(
        "http://localhost:8000/posts",
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      handleAddNewPost(data);
      navigate("/");
      toast.success("Product Created Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    }
  };

  const handleEdit = async () => {
    // prepare object
    const objectToSubmit = {
      title: form.title,
      body: form.body,
      coverImage: form.coverImage,
    };
    // call backend
    const { data } = await axios.put(
      `http://localhost:8000/posts/${id}`,
      objectToSubmit,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // navigate to home
    navigate("/");
    // update state of the frontend
    handleUpdatePost(data);
    // show toast
    toast.success("Product updated successfully!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.body || !form.coverImage) {
      toast.error("Please fill in all fields");
      return;
    }
    if (mood === "add") {
      handleAdd();
    } else {
      handleEdit();
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="avatar avatar-placeholder mb-4">
                <div className="bg-primary text-primary-content rounded-full w-16 h-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-base-content mb-2">
                {mood === "add" ? "Create New Post" : "Edit Post"}
              </h2>
              <p className="text-base-content/70">
                {mood === "add"
                  ? "Share your thoughts with the world"
                  : "Update your post content"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Title
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter post title"
                    className="input input-bordered w-full pl-12 transition-all duration-300 focus:input-primary"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.691 1.309 3.061 2.927 3.237.776.068 1.552.118 2.323.118.571 0 1.14-.025 1.707-.07.226-.017.452-.035.677-.055 2.176-.198 4.201-1.14 5.88-2.638 1.681-1.499 2.863-3.404 3.422-5.517.231-.873.237-1.85-.011-2.728-.246-.879-.741-1.687-1.42-2.325-1.356-1.276-3.272-1.965-5.204-1.87-1.933.096-3.801.796-5.195 1.945C4.616 5.236 3.66 6.878 3.66 8.592"
                    />
                  </svg>
                </div>
              </div>

              {/* Body Field as Textarea */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Body
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    id="body"
                    name="body"
                    value={form.body}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Write your post content here..."
                    className="textarea textarea-bordered w-full pl-12 pt-3 resize-y transition-all duration-300 focus:textarea-primary"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute left-4 top-4 text-base-content/50"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Cover Image Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">
                    Cover Image URL
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="coverImage"
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    className="input input-bordered w-full pl-12 transition-all duration-300 focus:input-primary"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
                {mood === "add" ? "Create Post" : "Update Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
