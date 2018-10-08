import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

const posts = [{
  id: '1',
  title: 'Post 1',
  body: 'Body 1',
  published: true,
  author: '1'
}, {
  id: '2',
  title: 'Post 2',
  body: 'Body 3',
  published: false,
  author: '1'
}, {
  id: '3',
  title: 'Post 3',
  body: 'Body 3',
  published: true,
  author: '2'
}]

const users = [{
  id: '1',
  name: 'Carlo',
  email: 'carlo@example.com',
  age: 27
},{
  id: '2',
  name: 'Gino',
  email: 'gino@example.com',
  age: 28
},{
  id: '3',
  name: 'Catapang',
  email: 'catapang@example.com',
  age: 29
}]

const comments = [{
  id: '1',
  text: 'Comment 1',
  author: '1',
  post: '1'
},{
  id: '2',
  text: 'Comment 2',
  author: '1',
  post: '2'
},{
  id: '3',
  text: 'Comment 3',
  author: '2',
  post: '1'
},{
  id: '4',
  text: 'Comment 4',
  author: '3',
  post: '3'
}]

// Type Definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }



  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: String!
    author: User!
    comments: [Comment!]!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts 
      }

      return posts.filter(post => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    comments() {
      return comments
    },
    me() {
      return  users.find(user => user.id == 1)
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
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email)

      if (emailTaken) throw new Error('Email already taken.');
      
      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)

      if (!userExists) throw new Error('User does not exists.')

      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post);

      return post
    },
    createComment(parent, args, ctx, infro) {
      const userExists = users.some(user => user.id === args.data.author)
      const postExists = posts.some(post => post.id === args.data.post && post.published)

      if (!userExists || !postExists) throw new Error('Unable to find user and post.')

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      comments.push(comment);

      return comment
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author)
    },
    post(parent, args, ctx, infro) {
      return posts.find(post => post.id === parent.post)
    }
  }
}

const server = new GraphQLServer({
  typeDefs, resolvers
})

server.start(() => {
  console.log('The server is up!')
})

