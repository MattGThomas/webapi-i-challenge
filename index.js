// implement your API here
const express = require('express')
const dataBase = require('./data/db.js')
const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.send('server is running')
})

server.post('/api/users', (req, res) => {
    const newUserInfo = req.body
    if (!newUserInfo.name || !newUserInfo.bio) {
        res.status(400).json({
            errorMessage: 'Please provide name and bio for the user'
        })
    } else {
        dataBase.insert(newUserInfo)
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(error => {
            res.status(500).json({
                error: 'There as an error while saving the user to the database'
            })
        })
    }
})

server.get('/api/users', (req, res) => {
    dataBase.find()
    .then(userList => {
        res.status(200).json(userList)
    })
    .catch(error => {
        res.status(500).json({
            error: 'the users information could not be retrieved'
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    dataBase.findById(id)
    .then(user => {
        if(user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({
                message: 'the user with the specified id does not exist'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            error: 'the user informatio could not be retrieved'
        })
    })
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id
    dataBase.remove(id)
    .then(id => {
        if(id > 0) {
            res.status(200).json({
                message: 'user was deleted'
            })
        } else {
            res.status(404).json({
                message: 'the user with the specified id does not exist'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            error: 'the user could not be removed'
        })
    })
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    const { changes } = req.body
    if(changes.name && changes.bio) {
        dataBase.update(id, changes)
        .then(changedUser => {
            if(changedUser) {
                res.status(200).json(changedUser)
            } else {
                res.status(400).json({
                    message: 'the user with the specified id does not exist'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'the user information could not be modified'
            })
        })
    } else {
        res.status(400).json({
            message: 'please provide name and bio for the user'
        })
    }       
})

const port = 5555
server.listen(port, () => console.log('api running'))