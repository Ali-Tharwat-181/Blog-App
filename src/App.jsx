import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import CreateNewPost from "./pages/CreateNewPost";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getPosts = async () => {
      const { data } = await axios.get(
        "https://blog-server.ali-tharwat.repl.co/posts"
      );
      setPosts(data);
    };
    getPosts();
  }, []);

  const handleAddNewPost = (post) => {
    setPosts([post, ...posts]);
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
              <CreateNewPost
                posts={posts}
                handleAddNewPost={handleAddNewPost}
                handleUpdatePost={handleUpdatePost}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
