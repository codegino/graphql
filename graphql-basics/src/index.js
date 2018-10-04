import { GraphQLServer } from 'graphql-yoga';

// title - String product name
// price - number as float
// releaseYear - number as int (optional)
// rating - number as float (optional)
// inStock - boolean

// Type Definitions (schema)
const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: String!
  }
`

// Resolvers
const resolvers = {
  Query: {
    me() {
      return  {
        id: '123456',
        name: 'Carlo Gino',
        email: 'carlogino@g.com',
        age: 28
      }
    },
    post() {
      return {
        id: '1234',
        title: 'Post 1',
        body: 'Post Body',
        published: '12-02-1990'
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs, resolvers
})

server.start(() => {
  console.log('The server is up!')
})

