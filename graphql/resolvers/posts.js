const Post = require("../../models/Post")
const { UserInputError, AuthenticationError} = require('apollo-server')
const checkAuth = require('../../util/check-auth')
const { argsToArgsConfig } = require("graphql/type/definition")

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find()
                return posts;
            } catch (error) {
                throw new Error(err)
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId)
                if(post) {
                    return post;
                }
                else {
                    throw new Error('Post not found')
                }
            } catch(err) {
                throw new Error(err)
            }

            }
        },
        Mutation: { 
            async createPost(_, {body}, context) {
                const user = checkAuth(context)

                if(body.trim() === '') {
                    throw new Error('Post body must not be empty')
                }
                console.log(user)
                const newPost = new Post({
                    body,
                    user: user.indexOf,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })

                const post = await newPost.save()

                return post;
            },
            async deletePost(_, { postId }, context) {
                const user = checkAuth(context);

                try {
                   const post = await Post.findById(postId);
                   if(user.username === post.username) {
                       await post.delete()
                       return 'Post deleted '
                   } 
                   else {
                       throw new AuthenticationError('action not allowed')
                   }
                } catch (error) {
                    throw new Error(err)
                }
            },
            async likePost(_, { postId }, context) {
                const { username } = checkAuth(context)
    
                const post = await Post.findById(postId)
                if(post) {
                    if (post.likes.find(like => like.username === username)) {
                        //post already liked and unlike it
                        post.likes = post.likes.filter(like => like.username !== user)
                    } else {
                        //Not liked ,like post
                        post.likes.push({
                            username,
                            createdAt: new Date().toISOString()
                        })
                    }
    
                    await post.save()
                    return post;
    
                } else  throw new UserInputError('POST NOT FOUND')
            }    
            },
            Subscription: {
                newPost: {
                    subscribe: (_, __,{ pubsub }) => pubsub.asyncIterator('NEW_POST')
                }
            }
        }
    