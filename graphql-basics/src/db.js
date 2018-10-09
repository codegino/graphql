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

const db = {
  users, posts, comments
}

export {db as default}
