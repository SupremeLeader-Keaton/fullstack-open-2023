import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls the event handler with the right details', async () => {
    const addBlogMock = jest.fn()
    const handleTitleChangeMock = jest.fn()
    const handleAuthorChangeMock = jest.fn()
    const handleUrlChangeMock = jest.fn()
    render(
      <BlogForm
        addBlog={addBlogMock}
        handleTitleChange={handleTitleChangeMock}
        handleAuthorChange={handleAuthorChangeMock}
        handleUrlChange={handleUrlChangeMock}
      />
    )

    const titleInput = screen.getByPlaceholderText('Blog title...')
    await userEvent.type(titleInput, 'Test Title')

    const authorInput = screen.getByPlaceholderText('Blog author...')
    await userEvent.type(authorInput, 'Test Author')

    const urlInput = screen.getByPlaceholderText('Blog URL...')
    await userEvent.type(urlInput, 'testurl.com')

    const submitButton = screen.getByRole('button', { type: 'submit' })
    await userEvent.click(submitButton)

    const [title] = handleTitleChangeMock.mock.calls[0]
    expect(title.target.value).toBe('Test Title')

    const [author] = handleAuthorChangeMock.mock.calls[0]
    expect(author.target.value).toBe('Test Author')

    const [url] = handleUrlChangeMock.mock.calls[0]
    expect(url.target.value).toBe('testurl.com')
  })
})