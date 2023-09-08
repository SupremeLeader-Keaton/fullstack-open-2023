/*eslint-disable*/

describe('Bloglist app ', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Keaton Yoputra',
      username: 'keaton',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })
  it('login form is shown', function () {
    cy.contains('Login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('keaton')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Keaton Yoputra logged in')
    })
    it('fails with wrong credentials', function () {
      cy.get('#username').type('keaton')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'keaton', password: 'secret' })
    })
    it('a blog can be created', function () {
      cy.get('#togglableButton').click()
      cy.get('#title-input').type('a cypress blog')
      cy.get('#author-input').type('cypress')
      cy.get('#url-input').type('https://cypress.io')
      cy.get('#create-button').click()
      cy.contains('a cypress blog')
    })
    it('users can like a blog', function () {
      cy.createBlog({
        title: 'a cypress blog',
        author: 'cypress',
        url: 'https://cypress.io'
      })
      cy.contains('View').click()
      cy.contains('Likes 0')
      cy.contains('Like').click()
      cy.contains('Likes 1')
    })
    it('and delete their own blog', function () {
      cy.createBlog({
        title: 'a cypress blog',
        author: 'cypress',
        url: 'https://cypress.io'
      })
      cy.contains('View').click()
      cy.contains('Remove').click()
      cy.contains('a cypress blog').should('not.exist')
    })
    it('but not someone else\'s', function () {
      cy.createBlog({
        title: 'a cypress blog',
        author: 'cypress',
        url: 'https://cypress.io'
      })
      cy.contains('Logout').click()
      const secondUser = {
        name: 'Second User',
        username: 'second',
        password: 'mystery'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, secondUser)
      cy.login({ username: 'second', password: 'mystery' })
      cy.contains('a cypress blog')
      cy.contains('View').click()
      cy.contains('Remove').should('not.exist')
    })
    it('and blogs are ordered according to likes descending', function () {
      cy.createBlog({
        title: 'The title with the second most likes',
        author: 'runnerup',
        url: 'https://secondplace.com'
      })
      cy.contains('The title with the second most likes')
      cy.createBlog({
        title: 'The title with the most likes',
        author: 'topdog',
        url: 'https://firstplace.com'
      })
      cy.contains('The title with the most likes')
      cy.get('.toggleDetails').eq(0).click()
      cy.contains('Like').click()
      cy.contains('Likes 1')
      cy.get('.toggleDetails').eq(0).click()
      cy.get('.toggleDetails').eq(1).click()
      cy.contains('Like').click()
      cy.contains('Likes 1')
      cy.contains('Like').click()
      cy.contains('Likes 2')
      cy.visit('')
    })
  })
})