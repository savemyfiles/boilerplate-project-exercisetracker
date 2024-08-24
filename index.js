const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
app.use(express.urlencoded({ extended: true }));


app.use(cors())
app.use(express.static('public'))

const users = [];
const exercices = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users/:_id/logs', (req, res) => {

    const { from, to, limit } = req.query;

    const user = users.find((user) => user._id === req.params._id);

    const exerciceList =
        exercices
            .filter(exercice => exercice._id === req.params._id)
            .filter(item => from ? new Date(item.date) >= new Date(from) : true)
            .filter(item => to ? new Date(item.date) <= new Date(to) : true)
            .slice(0, limit ? parseInt(limit) : exercices.length)
            .map(item => ({
                ...item,
                description: item.description,
                duration: item.duration,
                date: new Date(item.date).toDateString()
            }));


    res.json({
        user,
        count: exerciceList.length,
        log: exerciceList || []
    })

});

app.get('/api/users', (req, res) => {
    try {
        res.json(users)

    } catch (error) {
        res.json(error)
    }

});


app.post('/api/users', (req, res) => {

    try {
        const username = req.body.username;
        const id = uuidv4();

        const user = { _id: id , username: username }
        users.push(user);

        res.json(user)

    } catch (error) {
        res.json(error)
    }

});

app.post('/api/users/:_id/exercises', (req, res) => {
    const user = users.find((user) => user._id === req.params._id);

    try {

        const exercice = {
        _id: user._id,
        date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString(),
        duration: parseInt(req.body.duration),
        description: req.body.description
    }

        exercices.push(exercice);

        res.json({ ...user, ...exercice })

    } catch (error) {
        res.json(error)
    }

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
