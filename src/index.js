const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://pattamu:bqPvauaKLfc6SIBP@cluster0.eqx53.mongodb.net/Project_01-db", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use("/", route)

app.listen(process.env.PORT || 3000, (err)=> {
    console.log("Connected to PORT 3000")
})

