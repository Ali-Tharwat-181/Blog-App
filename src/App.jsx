import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import CreateNewPost from "./pages/CreateNewPost";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await axios.get(
          "https://blog-app-server-roan-xi.vercel.app/posts",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Handle error appropriately
      }
    };
    getPosts();
  }, []);

  const handleAddNewPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const handleUpdatePost = (updatedPost) => {
    const updatedPosts = posts.map((p) => {
      if (p._id === updatedPost._id) {
        return {
          ...updatedPost,
          createdBy: p.createdBy,
        };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const rollBackToOldState = (posts) => {
    setPosts(posts);
  };

  const handleDelete = (post) => {
    const newPosts = posts.filter((p) => p._id !== post._id);
    setPosts(newPosts);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogIn = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <>
      <ToastContainer />
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="mx-auto w-[80%] mt-2">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                posts={posts}
                rollBackToOldState={rollBackToOldState}
                handleDelete={handleDelete}
                isLoggedIn={isLoggedIn}
                storedUser={storedUser}
              />
            }
          />
          <Route path="/login" element={<Login handleLogIn={handleLogIn} />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/addPost/:id"
            element={
              <ProtectedRoute>
                <CreateNewPost
                  posts={posts}
                  handleAddNewPost={handleAddNewPost}
                  handleUpdatePost={handleUpdatePost}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
