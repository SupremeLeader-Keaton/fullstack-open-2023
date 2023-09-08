const BlogForm = ({
  addBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  newTitle,
  newAuthor,
  newUrl,
}) => {
  return (
    <>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        Title:<input id="title-input" value={newTitle} onChange={handleTitleChange} placeholder="Blog title..." /><br />
        Author:<input id="author-input" value={newAuthor} onChange={handleAuthorChange} placeholder="Blog author..." /><br />
        URL:<input id="url-input" value={newUrl} onChange={handleUrlChange} placeholder="Blog URL..." /><br />
        <button id="create-button" type='submit'>Create</button>
      </form>
    </>
  )
}
export default BlogForm