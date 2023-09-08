import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const addLikeMock = jest.fn()

  beforeEach(() => {
    const blog = {
      id: 1,
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://test.com',
      likes: 5,
      user: {
        name: 'Test User'
      }
    }
    container = render(<Blog blog={blog} addLike={addLikeMock} />).container
  })

  test('renders title and author', () => {
    expect(screen.getByText('Test Blog', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Test Author', { exact: false })).toBeInTheDocument()
  })

  test('hides details by default', () => {
    expect(container.querySelector('.details')).not.toBeInTheDocument()
  })

  test('shows url and likes details after clicking "View"', async () => {
    const button = screen.getByRole('button', { name: 'View' })
    await userEvent.click(button)

    expect(container.querySelector('.details')).toBeInTheDocument()
    expect(screen.getByText('https://test.com')).toBeInTheDocument()
    expect(screen.getByText('Likes 5', { exact: false })).toBeInTheDocument()
  })

  test('likes are properly handled and added', async () => {
    const viewButton = screen.getByRole('button', { name: 'View' })
    await userEvent.click(viewButton)
    expect(container.querySelector('.details')).toBeInTheDocument()
    const likeButton = screen.getByRole('button', { name: 'Like' })
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)
    expect(addLikeMock.mock.calls).toHaveLength(2) // Assert that the function was called twice
  })
})