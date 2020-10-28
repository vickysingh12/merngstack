const Post = require('../../models/Post')
const { UserInputError, AuthenticationError} = require('apollo-server')

const checkAuth = require('../../util/check-auth')
module.exports = {
    Mutation : {
        createComment : async(_, { postId, body}, context) => {
            const { username } = checkAuth(context)
            if(body.trim() === ''){
                throw new UserInputError('empty comment' , {
                    errors : {
                        body: 'Comment body must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId)

            if(post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();

                context.pubsub.publish('NEW_POST', {
                    newPost : post
                })
                return post;
            } else throw new UserInputError('Post not found')
        },
        async deleteComment(_, { postId , commentId}, context) {
            const { username } = checkAuth(context)
            const post = await Post.findById(postId)
            if(post) {

                function myFunction(value) {
                    return String(value._id) === String(commentId);
                }
                const commentIndex = post.comments.findIndex(myFunction);
                
                console.log(post.comments + '\n comment id is' +  commentId + '\n commindex is' + commentIndex)

                if(post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex,1)
                    await post.save();
                    return post;
                    
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } else {
                throw new UserInputError('Post not found')
            }
        }
    }
}