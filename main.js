const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const qraphQlSchema = require('./schema/index');
const qraphQlResolver = require('./resolvers/index');
/* models */

/* constructors */
const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: qraphQlSchema,
    rootValue: qraphQlResolver,
    graphiql: true,
}));

const options = {useUnifiedTopology: true, useNewUrlParser: true };
const connectionAtlas = `mongodb+srv://hatem:sanam@cluster0-sdbar.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const connectionLocal = `mongodb://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect( connectionLocal, options)
    .then(s => {
        app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
    })
    .catch(e => {
        throw e;
    });
