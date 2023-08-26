/* eslint-disable */
const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')

//
let token
beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
  userId = user._id

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    blog.user = userId
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})
//
test('blogs are returned as JSON with correct amount of blog posts', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.length).toBe(2)
})

test('blog posts are returned with id', async () => {
  const response = await api.get('/api/blogs').expect(200)

  const blogs = response.body
  expect(Array.isArray(blogs)).toBe(true)

  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog post can be added ', async () => {
  const newBlog = {
    title: 'A New Blog POST',
    author: 'POST Writer',
    url: 'http://www.blogpost.html',
    likes: 5,
    user: userId,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map((n) => n.title)
  expect(title).toContain('A New Blog POST')
})

test('blog posts are returned with likes', async () => {
  const newBlog = {
    title: 'A New Blog POST',
    author: 'POST Writer',
    url: 'http://www.blogpost.html',
    user: userId,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
  expect(lastBlog.likes).toBe(0)
})

test('blog post without title or url is not added ', async () => {
  const invalidBlog = {
    author: 'Invalid POST Writer',
    url: 'http://www.blogpost.html',
    likes: 5,
    user: userId,
  }
  const anotherInvalidBlog = {
    title: 'Invalid Blog POST',
    author: 'Invalid POST Writer',
    likes: 5,
    user: userId,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(invalidBlog)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(anotherInvalidBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('a blog post can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const title = blogsAtEnd.map((r) => r.title)
  expect(title).not.toContain(blogToDelete.title)
})

test('a blog post can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: 'The First Blog',
    author: 'The First Writer',
    url: 'https://firstwebsite.com/',
    likes: 999,
    user: userId,
  }

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  const firstBlog = blogsAtEnd[0]
  expect(firstBlog.likes).toBe(999)
})

test('blog post without token (unauthorized) is not added ', async () => {
  const newBlog = {
    title: 'A New Blog POST',
    author: 'POST Writer',
    url: 'http://www.blogpost.html',
    likes: 5,
    user: userId,
  }

  await api.post('/api/blogs').send(newBlog).expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

//
afterAll(async () => {
  await mongoose.connection.close()
})