const Event = require('../models/event');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {...user._doc, createdEvents: events(user._doc.createdEvents)}
        })
        .catch(error => { throw error })
};

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event.creator),
                    date: new Date(event._doc.date).toISOString()
                }
            })
        })
        .catch(error => { throw error })
};

module.exports = {
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
        //.populate('creator')
            .then(r => {
                return r.map(p => {
                    return {...p._doc, date: new Date(p.date).toISOString(),
                        creator: user.bind(this, p.creator._id)}
                })
            })
            .catch(e => console.log(e));
    },
    createEvent: args => {
        const event = new Event({
            title: args.inputEvent.title,
            description: args.inputEvent.description,
            date: new Date(args.inputEvent.date),
            creator: '5dab294ab843970854b33d59'
        });
        let createdEvent = {};
        return event.save()
            .then(r => {
                createdEvent = {...r._doc, creator: user(r._doc.creator)};
                return User.findById('5dab294ab843970854b33d59')
            })
            .then(user => {
                if (!user) throw new Error('User not exist!');
                user.createdEvents.push(event);
                return user.save();
            })
            .then(r => createdEvent)
            .catch(e => console.log(e));

    }
};
