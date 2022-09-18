const Membership = require('../models/Membership')

module.exports = {
    getMemberships: async (req, res) => {
        console.log(req.user)
        try {
            let currentDate = new Date()
            let oneMonth = new Date()
            oneMonth = oneMonth.setMonth(oneMonth.getMonth() + 1)
            console.log(currentDate, oneMonth)
            const membershipCards = await Membership.find({ userId: req.user.id })
            // forEach goes through membershipCards to add expired true/false and expiring soon true/false because status depends on your date.
            membershipCards.forEach(card => {
                card.expired = (new Date(card.expirationDate).getTime() < currentDate.getTime()) ? true : false;
                card.expiringSoon = (new Date(card.expirationDate).getTime() < new Date(oneMonth).getTime()) ? true : false;
            })
            // const itemsLeft = await Todo.countDocuments({ userId: req.user.id, completed: false })
            res.render('dashboard.ejs', { memberships: membershipCards }) //, left: itemsLeft, user: req.user
        } catch (err) {
            console.log(err)
        }
    },
    createMembership: async (req, res) => {
        if (pickMuseumList.options[pickMuseumList.selectedIndex].value == 'other') {
            let place_id = localStorage.getItem('organization')
            console.log('place_id acquired.')

        }

        try {
            await Membership.create({
                museumName: req.body.chooseMuseum,
                maxGuests: req.body.maxGuests,
                expirationDate: new Date(req.body.expiration).toDateString(),
                userId: req.user.id,
            })
            console.log('Membership has been added!')
            res.redirect('/membership')
        } catch (err) {
            console.log(err)
        }
    },
    deleteMembership: async (req, res) => {
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

// markComplete: async (req, res) => {
//     try {
//         await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, {
//             completed: true
//         })
//         console.log('Marked Complete')
//         res.json('Marked Complete')
//     } catch (err) {
//         console.log(err)
//     }
// },
// markIncomplete: async (req, res) => {
//     try {
//         await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, {
//             completed: false
//         })
//         console.log('Marked Incomplete')
//         res.json('Marked Incomplete')
//     } catch (err) {
//         console.log(err)
//     }
// },