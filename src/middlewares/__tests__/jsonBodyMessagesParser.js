const middy = require('../../middy')
const jsonBodyMessagesParser = require('../jsonBodyMessagesParser')

describe('📦  Middleware JSON Body Messages Parser', () => {
  test('It should parse a JSON request', () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.Records[0].body) // propagates the body as a response
    })

    handler.use(jsonBodyMessagesParser())

    // invokes the handler
    const event = {
      Records: [ {
        messageId: 'messageId',
        body: JSON.stringify({foo: 'bar'})
      }]
    }
    handler(event, {}, (_, body) => {
      expect(body).toEqual({foo: 'bar'})
    })
  })

  test('It should handle invalid JSON as an UnprocessableEntity', () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.Records[0].body) // propagates the body as a response
    })

    handler.use(jsonBodyMessagesParser())

    // invokes the handler
    const event = {
      Records: [ {
        messageId: 'messageId',
        body: 'make it broken' + JSON.stringify({foo: 'bar'})
      }]
    }

    handler(event, {}, (err) => {
      expect(err.message).toEqual('Content type defined as JSON but an invalid JSON was provided')
    })
  })

  test('It shouldn\'t process the body if no Records Array is passed', () => {
    const handler = middy((event, context, cb) => {
      cb(null, event) // propagates the body as a response
    })

    handler.use(jsonBodyMessagesParser())

    // invokes the handler
    const event = {
      Records: JSON.stringify({foo: 'bar'})
    }
    handler(event, {}, (_, nextevent) => {
      expect(nextevent).toEqual(event)
    })
  })

  test('It shouldn\'t process the body if object in Records Array has no messageId property', () => {
    const handler = middy((event, context, cb) => {
      cb(null, event) // propagates the body as a response
    })

    handler.use(jsonBodyMessagesParser())

    // invokes the handler
    const event = {
      Records: [ {
        body: JSON.stringify({foo: 'bar'})
      }]
    }
    handler(event, {}, (_, nextevent) => {
      expect(nextevent).toEqual(event)
    })
  })
})
