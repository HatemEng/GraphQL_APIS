const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
/* models */
const Event = require('./models/event');
const User = require('./models/user');
/* constructors */
const app = express();
app.use(bodyParser.json());

const events = [];
const schema = buildSchema(`
  type User {
    _id: ID!
    email: String!
    password: String
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


app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: {
        /* for user */
        users: () => {
          return User.find()
              .then(r => r.map(p => p._doc))
        },
        createUser: args => {
           return User.findOne({email: args.inputUser.email})
                .then(r => {
                    if (r) throw new Error("User already exist!");
                    return bcrypt.hash(args.inputUser.password, 12);
                })
               .then(r => {
                   const user = new User({
                       email: args.inputUser.email,
                       password: r
                   });
                   return user.save()
                       .then(r => r._doc)
                       .catch(e => console.log(e));
               })
                .catch(e => e);


        },
        /* for events*/
        events: () => {
            return Event.find()
                .populate('creator')
                .then(r => {
                    return r.map(p => {
                        return {...p._doc, date: new Date(p.date).toISOString()}
                    })
                })
                .catch(e => console.log(e));
        },
        createEvent: args => {
            const event = new Event({
                title: args.inputEvent.title,
                description: args.inputEvent.description,
                date: new Date(args.inputEvent.date),
                creator: '5da194c949078e103488d250'
            });
            let createdEvent = {};
            return event.save()
                .then(r => {
                    createdEvent = r._doc;
                    return User.findById('5da194c949078e103488d250')
                })
                .then(user => {
                    if (!user) throw new Error('User not exist!');
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(r => createdEvent)
                .catch(e => console.log(e));

        }
    },
    graphiql: true,
}));

const options = {useUnifiedTopology: true, useNewUrlParser: true };
const connectionAtlas = `mongodb+srv://hatem:sanam@cluster0-sdbar.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const connectionLocal = `mongodb://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect( connectionAtlas, options)
    .then(s => {
        app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
    })
    .catch(e => {
        throw e;
    });
