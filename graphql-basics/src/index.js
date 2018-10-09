import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';
import db from './db';

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, {db}, info) {
      if (!args.query) {
        return db.users
      }
      return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, {db}, info) {
      if (!args.query) {
        return db.posts 
      }

      return db.posts.filter(post => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    comments(parent, args, {db}, info) {
      return db.comments
    },
    me(parent, args, {db}, info) {
      return db.users.find(user => user.id == 1)
    },
    post() {
      return {
        id: '1234',
        title: 'Post 1',
        body: 'Post Body',
        published: '12-02-1990'
      }
    }
  },
  Mutation: {
    createUser(parent, args, {db}, info) {
      const emailTaken = db.users.some(user => user.email === args.data.email)

      if (emailTaken) throw new Error('Email already taken.');
      
      const user = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, {db}, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id)

      if (userIndex === -1) {
        throw new Error('User not found.')
      }

      const deletedUser = db.users.splice(userIndex, 1)[0];

      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id)
        }

        return !match
      })

      db.comments = db.comments.filter(comment => comment.author === args.id)

      return deletedUser
    },
    createPost(parent, args, {db}, info) {
      const userExists = db.users.some(user => user.id === args.data.author)

      if (!userExists) throw new Error('User does not exists.')

      const post = {
        id: uuidv4(),
        ...args.data
      }

      db.posts.push(post);

      return post
    },
    deletePost(parent, args, {db}, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id)

      if (postIndex === -1) {
        throw new Error('Post not found.')
      }

      const deletedPost = db.posts.splice(postIndex, 1)[0];

      db.comments = db.comments.filter(comment => comment.post === args.id)

      return deletedPost;
    },
    createComment(parent, args, {db}, info) {
      const userExists = db.users.some(user => user.id === args.data.author)
      const postExists = db.posts.some(post => post.id === args.data.post && post.published)

      if (!userExists || !postExists) throw new Error('Unable to find user and post.')

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      db.comments.push(comment);

      return comment
    },
    deleteComment(parent, args, {db}, info) {
      const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

      if(commentIndex === -1) {
        throw new Error('Comment does not exists.')
      }

      const deletedComment = db.comments.splice(commentIndex, 1)[0];

      return deletedComment;
    }
  },
  Post: {
    author(parent, args, {db}, info) {
      return db.users.find(user => user.id === parent.author)
    },
    comments(parent, args, {db}, info) {
      return db.comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, {db}, info) {
      return db.posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, {db}, info) {
      return db.comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, {db}, info) {
      return db.users.find(user => user.id === parent.author)
    },
    post(parent, args, {db}, infro) {
      return db.posts.find(post => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
})

server.start(() => {
  console.log('The server is up!')
})

