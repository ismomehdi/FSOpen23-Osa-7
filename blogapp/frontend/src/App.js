import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import storageService from "./services/storage";

import LoginForm from "./components/Login";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { likeBlog, initializeBlogs, removeBlog } from './reducers/blogReducer'
import { logUserIn, setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogs = useSelector(state => state.blogs)

  const blogFormRef = useRef();

  useEffect(() => {
    const user = storageService.loadUser();
    dispatch(setUser(user));
  }, [dispatch]);

  const user = useSelector(state => state.user)

  const notifyWith = (message, time) => {
    dispatch(setNotification(message, time))
  };

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      dispatch(setUser(user));
      storageService.saveUser(user);
      notifyWith("welcome!", 5);
    } catch (e) {
      notifyWith("wrong username or password", 5);
    }
  };

  const logout = async () => {
    dispatch(setUser(null))
    storageService.removeUser();
    notifyWith("logged out");
  };

  const like = async (blog) => {
    dispatch(likeBlog(blog))
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`, 5);
  };

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    );
    if (ok) {
      dispatch(removeBlog(blog))
      notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`, 5);
      // setBlogs(blogs.filter((b) => b.id !== blog.id));
    }
  };

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    );
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes;

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlog />
      </Togglable>
      <div>
        {blogs.slice().sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog)}
            canRemove={user && blog.user && blog.user.username === user.username}
            remove={() => remove(blog)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
