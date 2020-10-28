const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config')

module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization
    
    if(authHeader) {
        // Bearer ...
        const token = authHeader;
        if(token) {
            try {
                console.log(token)
                console.log(SECRET_KEY)

                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('Authentication header must be provided');
}