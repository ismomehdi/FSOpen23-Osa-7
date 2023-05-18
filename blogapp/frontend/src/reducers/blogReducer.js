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
      return state.filter(b => b.id !== action.payload)
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
    dispatch(like(object.id))
    await blogService.like(object)
  }
}

export const removeBlog = object => {
  return async dispatch => {
    dispatch(remove(object.id))
    await blogService.remove(object.id)
    await blogService.getAll()
}}

export default blogSlice.reducer