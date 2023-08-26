const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, blog) => accumulator + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((mostLiked, blog) =>
    blog.likes > mostLiked.likes ? blog : mostLiked
  )
}

const mostBlogs = (blogs) => {
  const authorsBlogsCount = _.countBy(blogs, 'author')
  const authorWithMostBlogs = _.maxBy(_.keys(authorsBlogsCount), (author) => authorsBlogsCount[author])
  const blogCount = authorsBlogsCount[authorWithMostBlogs]

  return { author: authorWithMostBlogs, blogs: blogCount }
}

const mostLikes = (blogs) => {
  const authorsLikes = _.groupBy(blogs, 'author')
  const authorsTotalLikes = _.mapValues(authorsLikes, (blogs) => _.sumBy(blogs, 'likes'))
  const authorWithMostLikes = _.maxBy(_.keys(authorsTotalLikes), (author) => authorsTotalLikes[author])
  const likes = authorsTotalLikes[authorWithMostLikes]

  return { author: authorWithMostLikes, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}