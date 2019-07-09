const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');
const env = require('./env');
const path = require('path')

const app = express();

//Cors implementation
app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen(env.port, () => {
    console.log(`Server running @ ${env.port}`)
});