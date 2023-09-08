import { useState } from 'react'

const Blog = ({ blog, user, removeBlog, addLike }) => {
  const [show, setShow] = useState(false)

  const toggleInfo = () => {
    setShow(!show)
  }

  const handleLike = () => {
    addLike(blog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="general">
        <b>{blog.title}</b> by {blog.author} <button className='toggleDetails' onClick={toggleInfo} name={show ? 'Hide' : 'View'}>{show ? 'Hide' : 'View'}</button>
      </div>
      {show && (
        <div className="details">
          <a href={blog.url}>{blog.url}</a>
          <br />Likes {blog.likes} <button onClick={handleLike} name='Like'>Like</button>
          <br />Added by {blog.user.name}
          {user && user.name === blog.user.name && (
            <>
              <br /><button onClick={handleRemove}>Remove</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog