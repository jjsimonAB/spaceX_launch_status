const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');


//Cors implementation

const app = express();

require('dotenv').config();
require('./config/passport');


const db = require('./config/connection').mongoURI;
app.use(cors())

app.use(bodyParser.json());

mongoose.connect(db, { 
        useNewUrlParser: true,
    })
    .then(() => console.log("Mongo connected... "))
    .catch(err => console.log(err));

app.use('/graphql', passport.authenticate('jwt', { session: false }), graphqlHTTP({
    schema,
    graphiql: true
}));

app.use('/auth', require('./routes/v1/auth'))

app.use(express.urlencoded({ extended: false}));

app.use(passport.initialize());

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running @ ${process.env.PORT}`)
});