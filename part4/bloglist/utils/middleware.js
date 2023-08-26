const jwt = require('jsonwebtoken')
const config = require('./config')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const userExtractor = (request, response, next) => {
  if (request.method === 'POST' || request.method === 'DELETE') {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7)
      try {
        const decodedToken = jwt.verify(token, config.SECRET)
        if (!decodedToken.id) {
          return response.status(401).json({ error: 'token invalid' })
        } else {
          request.user = decodedToken.id
        }
      } catch (error) {
        return response.status(401).json({ error: 'token invalid' })
      }
    } else {
      return response.status(401).json({ error: 'token missing' })
    }
  } else {
    request.user = null
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  requestLogger,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}