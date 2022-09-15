const Todo = require('../models/Todo')

module.exports = {
    getTodos: async (req, res) => {
        console.log(req.user)
        try {
            const todoItems = await Todo.find({ userId: req.user.id })
            const itemsLeft = await Todo.countDocuments({ userId: req.user.id, completed: false })
            res.render('todos.ejs', { todos: todoItems, left: itemsLeft, user: req.user })
        } catch (err) {
            console.log(err)
        }
    },
    createTodo: async (req, res) => {
        // Probably need an if statement to determine what should be used for the museumName sent to the DB. Should pull place_id from localstorage if applicable, and maybe other data too?
        try {
            await Todo.create({
                museumName: req.body.chooseMuseum,
                maxGuests: req.body.maxGuests,
                expirationDate: new Date(req.body.expiration).toDateString(),
                userId: req.user.id
            })
            console.log('Todo has been added!')
            res.redirect('/todos')
        } catch (err) {
            console.log(err)
        }
    },
    markComplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, {
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        } catch (err) {
            console.log(err)
        }
    },
    markIncomplete: async (req, res) => {
        try {
            await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, {
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        } catch (err) {
            console.log(err)
        }
    },
    deleteTodo: async (req, res) => {
        console.log(req.body.todoIdFromJSFile)
        try {
            await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile })
            console.log('Deleted Todo')
            res.json('Deleted It')
        } catch (err) {
            console.log(err)
        }
    }
}    