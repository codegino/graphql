const Query = {
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
}

export {Query as default}
