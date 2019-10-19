const Event = require('../models/event');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {...user._doc, createdEvents: events(user._doc.createdEvents)}
    } catch (e) {
        throw e;
    }
};

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return {
                ...event._doc,
                creator: user.bind(this, event.creator),
                date: new Date(event._doc.date).toISOString()
            }
        });
    } catch (e) {
        throw e
    }
};

module.exports = {
    /* for user */
    users: async () => {
        try {
            const users = await User.find();
            return users.map(u => {
                return {
                    ...u._doc,
                    createdEvents: events(u._doc.createdEvents)
                }
            })
        } catch (e) {
            throw e;
        }
    },
    createUser: async args => {
        try {
            const users = await User.findOne({email: args.inputUser.email});
            if (users) throw new Error("User already exist!");
            const hashedPassword = await bcrypt.hash(args.inputUser.password, 12);
            const user = new User({
                email: args.inputUser.email,
                password: hashedPassword
            });
            return user.save()
        } catch (e) {
            throw e
        }
    },
    /* for events*/
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(p => {
                return {...p._doc, date: new Date(p.date).toISOString(),
                    creator: user.bind(this, p.creator._id)}
            });
        } catch (e) {
            throw e;
        }
    },
    createEvent: async args => {
        try  {
            const event = new Event({
                title: args.inputEvent.title,
                description: args.inputEvent.description,
                date: new Date(args.inputEvent.date),
                creator: '5dab294ab843970854b33d59'
            });
            const newEvent = await event.save();
            const creator = await User.findById('5dab294ab843970854b33d59');
            if (!creator) throw new Error('User not exist!');
            creator.createdEvents.push(newEvent._doc);
            creator.save();
            return {...newEvent._doc, creator: user(newEvent._doc.creator)};
        } catch (e) {
            throw e;
        }
    }
};
