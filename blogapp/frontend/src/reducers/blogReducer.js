import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    like(state, action) {
      const blogToLike = state.find(b => b.id === action.payload)
      blogToLike.likes++
    },
    remove(state, action) {
      return action.payload
}}
})

export const { like, addBlog, setBlogs, remove } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(addBlog(newBlog))
  }
}

export const likeBlog = object => {
  return async dispatch => {
    const updatedBlog = await blogService.like(object)
    dispatch(like(updatedBlog.id))
  }
}

export const removeBlog = object => {
  return async dispatch => {
    await blogService.remove(object.id)
    const blogs = await blogService.getAll()
    dispatch(remove(blogs))
}}

export default blogSlice.reducer