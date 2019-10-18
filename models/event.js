const mongoos = require('mongoose');
const Schema = mongoos.Schema;
const eventSchemas = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectID,
        ref: 'User'
    }
});

module.exports = mongoos.model('Event', eventSchemas);
