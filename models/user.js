const mongoos = require('mongoose');
const Schema = mongoos.Schema;
const eventSchemas = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [{
        type: Schema.Types.ObjectID,
        ref: 'Event'
    }]
});

module.exports = mongoos.model('User', eventSchemas);
