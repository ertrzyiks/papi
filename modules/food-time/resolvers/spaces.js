const { spacesForUser } = require('../models/space')

module.exports = (_, {}, context) => {
  return spacesForUser(context.user)
}
