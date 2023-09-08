import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(true)
  const [message, setMessage] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
      setLoginVisible(false)
    }
  }, [setUser])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage(['error', 'wrong username or password'])
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setLoginVisible(true)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat({ ...returnedBlog, user: { id: returnedBlog.user, name: user.name } }))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setMessage(['success', `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`])
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const addLike = (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }

    blogService.update(blog.id, updatedBlog)
      .then(() => {
        const updatedBlogs = blogs.map((b) =>
          b.id === blog.id ? { ...b, likes: updatedBlog.likes } : b
        )
        setBlogs(updatedBlogs)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const removeBlog = (id) => {
    blogService.remove(id)
      .then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
      })
  }

  const loginForm = () => {
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      </div>
    )
  }

  const blogFormRef = useRef()
  const blogForm = () => (
    <Togglable buttonLabel="New Blog" ref={blogFormRef}>
      <BlogForm
        addBlog={addBlog}
        newTitle={newTitle}
        newAuthor={newAuthor}
        newUrl={newUrl}
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleUrlChange={handleUrlChange}
      />
    </Togglable>
  )

  return (
    <div>
      <h1>Blog List</h1>

      <Notification message={message} />

      {!user && loginForm()}

      {user && <div>
        <p><b>{user.name}</b> logged in <button onClick={handleLogout}>Logout</button></p>
        {blogForm()}
        <br />

        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => <Blog key={blog.id} blog={blog} user={user} removeBlog={removeBlog} addLike={addLike} />)}
      </div>}

    </div>
  )
}

export default App