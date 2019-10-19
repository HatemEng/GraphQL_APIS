const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]!
  }
  input InputUser {
    email: String!
    password: String!
  }
  type Event {
    _id: ID!
    title: String!
    description: String
    date: String!
    creator: User
  }
  input InputEvent {
    title: String!
    description: String
    date: String!
  }
  type RootQuery {
    users: [User!]!
    events: [Event!]!
  }
  type RootMutation {
    createUser(inputUser: InputUser): User
    createEvent(inputEvent: InputEvent): Event
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
