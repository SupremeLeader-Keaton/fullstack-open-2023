/* eslint-disable */
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'The First Blog',
    author: 'The First Writer',
    url: 'https://firstwebsite.com/',
    likes: 101,    
  },
  {
    title: 'The Second Blog',
    author: 'The Second Writer',
    url: 'http://secondwebsite.com',
    likes: 201,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'The Non Existing Blog',
    author: 'The Non Existing Writer',
    url: 'http://www.nonexisting.com',
    likes: 1,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
