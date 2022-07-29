const express = require('express');
const routes = require('./routes/v1')

require('dotenv').config();


const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

app.use('/v1', routes);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


