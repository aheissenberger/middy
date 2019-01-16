const createError = require('http-errors')

module.exports = () => ({
  before: (handler, next) => {
    const { Records } = handler.event
    if (!(Records && Array.isArray(Records) && Records.length && Records[0].messageId)) {
      return next()
    }
    for (let index = 0; index < Records.length; index++) {
      try {
        handler.event.Records[index].body = JSON.parse(handler.event.Records[index].body)
      } catch (err) {
        throw new createError.UnprocessableEntity(
          'Content type defined as JSON but an invalid JSON was provided'
        )
      }
    }
    next()
  }
})
