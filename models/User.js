const { model , Schema } = require('mongoose')

const userSchema = new Schema({
   username: String,
   password: String,
   email: String,
   createdAt: String,
   comments: [
       {
           body: String,
           username: String,
           createdAt: String
       }
   ],
   likes : [
       {
           username : String,
           createdAt : String
       }
   ],
   user : {
       type: Schema.Types.ObjectId,
       ref: 'users'
   }
})

module.exports = model('User', userSchema);